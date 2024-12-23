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
  CollectionReference,
} from "firebase/firestore";
import { has, get } from "lodash";
import * as yup from "yup";

import { FormService } from "services/FormService";
import { PromiseResponse } from "types/promiseResponse";
import { ClassRef } from "types/class";
// import { ObjectSchema, ValidationError, date as yupDate } from "yup";

// type FirestoreEnvironment = "dev" | "stage" | "prod";

// import { CREATE_METADATA_KEY, UPDATE_METADATA_KEY, BaseFieldConfig } from "decorators/firestore";

// const createMetadataKey = Symbol.for("createMetadata");
// const updateMetadataKey = Symbol.for("updateMetadata");

type WhereConditions<T> =
  | [keyof T, WhereFilterOp, keyof T]
  | [keyof T, WhereFilterOp, string]
  | [string, WhereFilterOp, keyof T]
  | [string, WhereFilterOp, string];

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

// type GetSingleProps<T = any> = GetProps<T>;

// interface LogErrorProps {
//   type: string;
//   payload: any;
// }

// interface FirestoreServiceProps {
//   modelName: string;
//   // collectionSchema: ObjectSchema<any>;
//   // firebaseConfig: any;
//   // environment?: FirestoreEnvironment;
//   // logErrorCollection?: string;
// }

// type ClassRef = new (...args: any[]) => any;

class FirestoreService<FirestoreDocument> extends FormService {
  private collectionName: string = "";
  private DocumentDto: ClassRef;
  // #logErrorModelName = "";
  // #collectionSchema: ObjectSchema<any>;
  // #environment: FirestoreEnvironment;
  private firestore: Firestore;
  private collectionRef: CollectionReference<DocumentData, DocumentData>;
  // #latestGetAllResponseMap: Map<
  //   number,
  //   {
  //     querySnapshot: QuerySnapshot<DocumentData, DocumentData>;
  //   }
  // > = new Map();

  constructor({
    collectionName,
    DocumentDto,
    // collectionSchema,
    // environment = "dev",
    // firebaseConfig,
    // logErrorCollection = "errors",
  }: {
    collectionName: string;
    DocumentDto: ClassRef;
  }) {
    super();
    // this.collectionName = collectionName;
    this.collectionName = collectionName;
    // console.log({ collectionName: this.collectionName });
    // console.log(DocumentDto);
    this.DocumentDto = DocumentDto;
    // this.#logErrorModelName = `${environment}-${logErrorCollection}`;
    // this.#collectionSchema = collectionSchema.shape({
    //   createdAt: yupDate().nullable(),
    //   updatedAt: yupDate().nullable(),
    //   deletedAt: yupDate().nullable(),
    // });
    // this.#environment = environment;
    const app = getApp();
    this.firestore = getFirestore(app);
    this.collectionRef = collection(this.firestore, this.collectionName);
  }

  // async #logError(payload: LogErrorProps): Promise<void> {
  //   const dbRef = collection(this.#firestore, this.#logErrorModelName);

  //   await addDoc(dbRef, {
  //     ...payload,
  //     createdAt: Timestamp.fromDate(new Date()),
  //   });
  // }

  // getEnvironment() {
  //   return this.#environment;
  // }

  // onChange(
  //   idOrWhereCondition: string | WhereConditions<FirestoreDocument>,
  //   callback: (doc?: FirestoreDocument | undefined) => void
  // ) {
  //   let docRef: any;
  //   let unsubscribe: Unsubscribe;

  //   if (typeof idOrWhereCondition === "string") {
  //     docRef = doc(
  //       this.#firestore,
  //       this.#modelName,
  //       idOrWhereCondition as string
  //     );
  //     unsubscribe = onSnapshot(
  //       docRef,
  //       (doc: DocumentSnapshot<DocumentData>) => {
  //         if (doc && doc.exists()) {
  //           const item = this.#parseItem(doc);
  //           callback(item);
  //         } else {
  //           callback();
  //         }
  //       }
  //     );
  //   } else {
  //     const modelRef = collection(this.#firestore, this.#modelName);
  //     docRef = query(
  //       modelRef,
  //       where(
  //         idOrWhereCondition[0] as string,
  //         idOrWhereCondition[1],
  //         idOrWhereCondition[2]
  //       )
  //     );

  //     unsubscribe = onSnapshot(
  //       docRef,
  //       (querySnapshot: QuerySnapshot<DocumentData>) => {
  //         if (!querySnapshot.empty) {
  //           const items: FirestoreDocument[] = [];

  //           querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
  //             const item = this.#parseItem(doc);
  //             items.push(
  //               this.#collectionSchema.cast(item, { stripUnknown: true })
  //             );
  //           });

  //           callback(items[0]);
  //         } else {
  //           callback();
  //         }
  //       }
  //     );
  //   }

  //   return unsubscribe;
  // }

  // onMultipleChanges(
  //   idOrWhereCondition: WhereConditions<FirestoreDocument> | null = null,
  //   callback: (docs?: FirestoreDocument[] | undefined) => void
  // ) {
  //   const modelRef = collection(this.#firestore, this.#modelName);
  //   const docRef =
  //     idOrWhereCondition !== null
  //       ? query(
  //           modelRef,
  //           where(
  //             idOrWhereCondition[0] as string,
  //             idOrWhereCondition[1],
  //             idOrWhereCondition[2]
  //           )
  //         )
  //       : query(modelRef);

  //   const unsubscribe = onSnapshot(
  //     docRef,
  //     (querySnapshot: QuerySnapshot<DocumentData>) => {
  //       if (!querySnapshot.empty) {
  //         const items: FirestoreDocument[] = [];

  //         querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
  //           const item = this.#parseItem(doc);
  //           items.push(
  //             this.#collectionSchema.cast(item, { stripUnknown: true })
  //           );
  //         });

  //         callback(items);
  //       } else {
  //         callback();
  //       }
  //     }
  //   );

  //   return unsubscribe;
  // }

  getById = async (id: string): Promise<PromiseResponse<FirestoreDocument | null>> => {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const item = await getDoc(docRef);
      let dtoItem: any = null;

      if (item.exists()) {
        dtoItem = new this.DocumentDto(item.data());
      }

      return { data: dtoItem, error: null };
    } catch (error) {
      console.log("getById error:");
      console.log(error);

      return { data: null, error };
    }
  };

  getAll = async (props?: GetAllProps<FirestoreDocument>): Promise<PromiseResponse<FirestoreDocument[]>> => {
    try {
      // console.group("getAll");
      // console.log(this.collectionName);

      const whereConditions = props?.whereConditions || [];
      // const limitBy = props?.limitBy;
      // const pagination = props?.pagination;
      // const showDeleted = props?.showDeleted || false;

      // const items: FirestoreDocument[] = [];
      let collectionRef = query(collection(this.firestore, this.collectionName));
      // let collectionRef = query(modelRef, orderBy("createdAt", "desc"));

      // if (limitBy !== undefined) {
      //   queryRef = query(queryRef, limit(limitBy));
      // }

      // if (!showDeleted) {
      //   queryRef = query(queryRef, where("deletedAt", "==", null));
      // }

      whereConditions.forEach((whereCondition) => {
        collectionRef = query(collectionRef, where(whereCondition[0] as string, whereCondition[1], whereCondition[2]));
      });
      // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
      // const querySnapshot = await getDocs(queryRef);
      // const querySnapshot = await getDocs(
      //   collection(this.firestore, this.collectionName)
      // );
      const querySnapshot = await getDocs(collectionRef);
      const items: FirestoreDocument[] = [];
      // querySnapshot.
      querySnapshot.forEach((doc) => {
        // console.log(doc);
        // doc
        const dtoItem = new this.DocumentDto({ ...doc.data(), id: doc.id });
        items.push(dtoItem);
      });

      return { data: items, error: null };
    } catch (error) {
      console.log(error);
      // const errorPayload = JSON.parse(
      //   JSON.stringify(error, Object.getOwnPropertyNames(error))
      // );
      // firebase error
      // await this.#logError({ type: "FirebaseError", payload: errorPayload });

      // throw error;
      return { data: [], error: true };
    } finally {
      console.groupEnd();
    }
  };

  // async getSingle(
  //   props?: GetSingleProps<FirestoreDocument>
  // ): Promise<FirestoreDocument | null> {
  //   try {
  //     const items = await this.getAll({ ...props, limitBy: 1 });
  //     const response = items.length ? items[0]! : null;

  //     return response;
  //   } catch (error) {
  //     const errorPayload = JSON.parse(
  //       JSON.stringify(error, Object.getOwnPropertyNames(error))
  //     );
  //     // firebase error
  //     await this.#logError({ type: "FirebaseError", payload: errorPayload });

  //     throw error;
  //   }
  // }

  create = async (item: FirestoreDocument): Promise<PromiseResponse<FirestoreDocument | null>> => {
    try {
      // const app = getApp();
      // this.firestore = getFirestore(app);
      // console.log({ coll: this.collectionName });
      // const collectionRef = collection(getFirestore(app), this.collectionName);
      // console.log("this.DocumentDto:");
      // console.log(this.DocumentDto);
      // const itemToAdd = new this.DocumentDto({
      //   ...item,
      //   // createdAt: Timestamp.fromDate(new Date()),
      //   // updatedAt: null,
      //   // deletedAt: null,
      // });
      const documentToAdd = {
        ...JSON.parse(JSON.stringify(item)),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: null,
        deletedAt: null,
      };

      const createdItemRef = await addDoc(this.collectionRef, documentToAdd);
      const createdItem = { ...documentToAdd, id: createdItemRef.id };
      // const createdItem = { ...documentToAdd, id: "createdItemRef.id" };

      return { data: createdItem, error: null };
    } catch (error) {
      console.log(error);
      // const errorPayload = JSON.parse(
      //   JSON.stringify(error, Object.getOwnPropertyNames(error))
      // );
      // if (error instanceof ValidationError) {
      //   await this.#logError({
      //     type: "ValidationError",
      //     payload: errorPayload,
      //   });
      // } else {
      //   // firebase error
      //   await this.#logError({ type: "FirebaseError", payload: errorPayload });
      // }

      return { data: null, error };
    }
  };

  // async update(id: string, item: FirestoreDocument) {
  //   try {
  //     const docRef = doc(this.#firestore, this.#modelName, id);

  //     await this.#collectionSchema.validate(item);

  //     const cleanItem = this.#collectionSchema.cast(item, {
  //       stripUnknown: true,
  //     });
  //     const cleanItemMap = new Map(Object.entries(cleanItem));
  //     cleanItemMap.delete("id");
  //     cleanItemMap.delete("createdAt");
  //     cleanItemMap.delete("updatedAt");
  //     cleanItemMap.delete("deletedAt");

  //     await setDoc(
  //       docRef,
  //       {
  //         ...Object.fromEntries(cleanItemMap),
  //         updatedAt: Timestamp.fromDate(new Date()),
  //       },
  //       { merge: true }
  //     );
  //   } catch (error) {
  //     const errorPayload = JSON.parse(
  //       JSON.stringify(error, Object.getOwnPropertyNames(error))
  //     );
  //     if (error instanceof ValidationError) {
  //       await this.#logError({
  //         type: "ValidationError",
  //         payload: errorPayload,
  //       });
  //     } else {
  //       // firebase error
  //       await this.#logError({ type: "FirebaseError", payload: errorPayload });
  //     }

  //     throw error;
  //   }
  // }

  // async restore(id: string) {
  //   try {
  //     const docRef = doc(this.#firestore, this.#modelName, id);

  //     await setDoc(
  //       docRef,
  //       {
  //         deletedAt: null,
  //       },
  //       { merge: true }
  //     );
  //   } catch (error) {
  //     const errorPayload = JSON.parse(
  //       JSON.stringify(error, Object.getOwnPropertyNames(error))
  //     );
  //     if (error instanceof ValidationError) {
  //       await this.#logError({
  //         type: "ValidationError",
  //         payload: errorPayload,
  //       });
  //     } else {
  //       // firebase error
  //       await this.#logError({ type: "FirebaseError", payload: errorPayload });
  //     }

  //     throw error;
  //   }
  // }

  // async delete(id: string, isSoftDelete = true) {
  //   try {
  //     const docRef = doc(this.#firestore, this.#modelName, id);
  //     if (isSoftDelete) {
  //       await setDoc(
  //         docRef,
  //         {
  //           deletedAt: Timestamp.fromDate(new Date()),
  //         },
  //         { merge: true }
  //       );
  //     } else {
  //       await deleteDoc(docRef);
  //     }
  //   } catch (error) {
  //     const errorPayload = JSON.parse(
  //       JSON.stringify(error, Object.getOwnPropertyNames(error))
  //     );
  //     // firebase error
  //     await this.#logError({ type: "FirebaseError", payload: errorPayload });

  //     throw error;
  //   }
  // }
}

export { PaginationOptions, FirestoreService };
// export type { FirestoreServiceProps };
