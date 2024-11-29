// https://github.com/eralvarez/firebase-utils/blob/master/src/services/FirestoreService.ts

import { getApp, getApps, initializeApp } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  where,
  Timestamp,
  DocumentData,
  WhereFilterOp,
  Firestore,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { has, get } from "lodash";
import { ObjectSchema, ValidationError, date as yupDate } from "yup";

type FirestoreEnvironment = "dev" | "stage" | "prod";

type WhereConditions<T> = [keyof T, WhereFilterOp, any];

interface GetProps<T> {
  whereConditions?: WhereConditions<T>[];
}

enum PaginationOptions {
  NEXT = "next",
  PREVIOUS = "previous",
}

interface GetAllProps<T> extends GetProps<T> {
  limitBy?: number;
  page?: number;
  pagination?: PaginationOptions;
  showDeleted?: boolean;
}

type GetSingleProps<T = any> = GetProps<T>;

interface LogErrorProps {
  type: string;
  payload: any;
}

interface FirestoreServiceProps {
  modelName: string;
  collectionSchema: ObjectSchema<any>;
  firebaseConfig: any;
  environment?: FirestoreEnvironment;
  logErrorCollection?: string;
}

class FirestoreService<FirestoreCollection> {
  #modelName = "";
  #logErrorModelName = "";
  #collectionSchema: ObjectSchema<any>;
  #environment: FirestoreEnvironment;
  #firestore: Firestore;
  #latestGetAllResponseMap: Map<
    number,
    {
      querySnapshot: QuerySnapshot<DocumentData, DocumentData>;
    }
  > = new Map();

  constructor({
    modelName,
    collectionSchema,
    environment = "dev",
    firebaseConfig,
    logErrorCollection = "errors",
  }: FirestoreServiceProps) {
    this.#modelName = `${environment}-${modelName}`;
    this.#logErrorModelName = `${environment}-${logErrorCollection}`;
    this.#collectionSchema = collectionSchema.shape({
      createdAt: yupDate().nullable(),
      updatedAt: yupDate().nullable(),
      deletedAt: yupDate().nullable(),
    });
    this.#environment = environment;
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    this.#firestore = getFirestore(app);
  }

  #parseItem(doc: DocumentSnapshot<DocumentData>): FirestoreCollection {
    const item = doc.data();
    const dateKeys = ["createdAt", "updatedAt", "deletedAt"];
    const dateMap = new Map();

    for (const dateKey of dateKeys) {
      if (has(item, dateKey) && get(item, dateKey) instanceof Timestamp) {
        dateMap.set(dateKey, get(item, dateKey).toDate());
      }
    }

    return {
      ...item,
      id: doc.id,
      ...Object.fromEntries(dateMap),
    };
  }

  async #logError(payload: LogErrorProps): Promise<void> {
    const dbRef = collection(this.#firestore, this.#logErrorModelName);

    await addDoc(dbRef, {
      ...payload,
      createdAt: Timestamp.fromDate(new Date()),
    });
  }

  getEnvironment() {
    return this.#environment;
  }

  onChange(
    idOrWhereCondition: string | WhereConditions<FirestoreCollection>,
    callback: (doc?: FirestoreCollection | undefined) => void
  ) {
    let docRef: any;
    let unsubscribe: Unsubscribe;

    if (typeof idOrWhereCondition === "string") {
      docRef = doc(
        this.#firestore,
        this.#modelName,
        idOrWhereCondition as string
      );
      unsubscribe = onSnapshot(
        docRef,
        (doc: DocumentSnapshot<DocumentData>) => {
          if (doc && doc.exists()) {
            const item = this.#parseItem(doc);
            callback(item);
          } else {
            callback();
          }
        }
      );
    } else {
      const modelRef = collection(this.#firestore, this.#modelName);
      docRef = query(
        modelRef,
        where(
          idOrWhereCondition[0] as string,
          idOrWhereCondition[1],
          idOrWhereCondition[2]
        )
      );

      unsubscribe = onSnapshot(
        docRef,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          if (!querySnapshot.empty) {
            const items: FirestoreCollection[] = [];

            querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
              const item = this.#parseItem(doc);
              items.push(
                this.#collectionSchema.cast(item, { stripUnknown: true })
              );
            });

            callback(items[0]);
          } else {
            callback();
          }
        }
      );
    }

    return unsubscribe;
  }

  onMultipleChanges(
    idOrWhereCondition: WhereConditions<FirestoreCollection> | null = null,
    callback: (docs?: FirestoreCollection[] | undefined) => void
  ) {
    const modelRef = collection(this.#firestore, this.#modelName);
    const docRef =
      idOrWhereCondition !== null
        ? query(
            modelRef,
            where(
              idOrWhereCondition[0] as string,
              idOrWhereCondition[1],
              idOrWhereCondition[2]
            )
          )
        : query(modelRef);

    const unsubscribe = onSnapshot(
      docRef,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        if (!querySnapshot.empty) {
          const items: FirestoreCollection[] = [];

          querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
            const item = this.#parseItem(doc);
            items.push(
              this.#collectionSchema.cast(item, { stripUnknown: true })
            );
          });

          callback(items);
        } else {
          callback();
        }
      }
    );

    return unsubscribe;
  }

  async getById(id: string): Promise<FirestoreCollection> {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);
      const item = await getDoc(docRef);

      return this.#collectionSchema.cast(this.#parseItem(item), {
        stripUnknown: true,
      });
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async getAll(
    props?: GetAllProps<FirestoreCollection>
  ): Promise<FirestoreCollection[]> {
    try {
      const whereConditions = props?.whereConditions || [];
      const limitBy = props?.limitBy || 10;
      const pagination = props?.pagination;
      const showDeleted = props?.showDeleted || false;

      const items: FirestoreCollection[] = [];
      const modelRef = collection(this.#firestore, this.#modelName);
      let queryRef = query(
        modelRef,
        limit(limitBy),
        orderBy("createdAt", "desc")
      );

      if (
        pagination !== undefined &&
        this.#latestGetAllResponseMap.has(limitBy)
      ) {
        const latestGetAllResponse = this.#latestGetAllResponseMap.get(limitBy);

        if (pagination === PaginationOptions.NEXT) {
          queryRef = query(
            queryRef,
            startAfter(latestGetAllResponse?.querySnapshot.docs.at(-1)),
            limit(limitBy)
          );
        } else if (pagination === PaginationOptions.PREVIOUS) {
          queryRef = query(
            queryRef,
            endBefore(latestGetAllResponse?.querySnapshot.docs.at(0)),
            limitToLast(limitBy)
          );
        }
      }

      if (!showDeleted) {
        queryRef = query(queryRef, where("deletedAt", "==", null));
      }

      whereConditions.forEach((whereCondition) => {
        queryRef = query(
          queryRef,
          where(
            whereCondition[0] as string,
            whereCondition[1],
            whereCondition[2]
          )
        );
      });
      // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
      let querySnapshot = await getDocs(queryRef);

      if (querySnapshot.docs.length > 0) {
        this.#latestGetAllResponseMap.set(limitBy, {
          querySnapshot,
        });
      } else {
        const lastQuerySnapshot =
          this.#latestGetAllResponseMap.get(limitBy)?.querySnapshot;
        querySnapshot = lastQuerySnapshot!;

        this.#latestGetAllResponseMap.set(limitBy, {
          querySnapshot,
        });
      }

      if (querySnapshot) {
        querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
          const item = this.#parseItem(doc);
          items.push(this.#collectionSchema.cast(item, { stripUnknown: true }));
        });
      }

      return items;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async getSingle(
    props?: GetSingleProps<FirestoreCollection>
  ): Promise<FirestoreCollection | null> {
    try {
      const items = await this.getAll({ ...props, limitBy: 1 });
      const response = items.length ? items[0]! : null;

      return response;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async create(item: FirestoreCollection): Promise<FirestoreCollection> {
    try {
      await this.#collectionSchema.validate(item);
      const dbRef = collection(this.#firestore, this.#modelName);

      const cleanItem = this.#collectionSchema.cast(item, {
        stripUnknown: true,
      });

      const createdItemRef = await addDoc(dbRef, {
        ...cleanItem,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: null,
        deletedAt: null,
      });

      const createdItem = await this.getById(createdItemRef.id);
      return createdItem;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (error instanceof ValidationError) {
        await this.#logError({
          type: "ValidationError",
          payload: errorPayload,
        });
      } else {
        // firebase error
        await this.#logError({ type: "FirebaseError", payload: errorPayload });
      }

      throw error;
    }
  }

  async update(id: string, item: FirestoreCollection) {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);

      await this.#collectionSchema.validate(item);

      const cleanItem = this.#collectionSchema.cast(item, {
        stripUnknown: true,
      });
      const cleanItemMap = new Map(Object.entries(cleanItem));
      cleanItemMap.delete("id");
      cleanItemMap.delete("createdAt");
      cleanItemMap.delete("updatedAt");
      cleanItemMap.delete("deletedAt");

      await setDoc(
        docRef,
        {
          ...Object.fromEntries(cleanItemMap),
          updatedAt: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (error instanceof ValidationError) {
        await this.#logError({
          type: "ValidationError",
          payload: errorPayload,
        });
      } else {
        // firebase error
        await this.#logError({ type: "FirebaseError", payload: errorPayload });
      }

      throw error;
    }
  }

  async restore(id: string) {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);

      await setDoc(
        docRef,
        {
          deletedAt: null,
        },
        { merge: true }
      );
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (error instanceof ValidationError) {
        await this.#logError({
          type: "ValidationError",
          payload: errorPayload,
        });
      } else {
        // firebase error
        await this.#logError({ type: "FirebaseError", payload: errorPayload });
      }

      throw error;
    }
  }

  async delete(id: string, isSoftDelete = true) {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);
      if (isSoftDelete) {
        await setDoc(
          docRef,
          {
            deletedAt: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        );
      } else {
        await deleteDoc(docRef);
      }
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }
}

export { FirestoreService, PaginationOptions };
export type { FirestoreServiceProps };
