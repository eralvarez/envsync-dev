import BaseDto from "dtos/BaseDto";
import { getApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { FirestoreService } from "services/FirestoreService";

class Project extends BaseDto {
  id?: string | null;
  name: string | undefined;
  description?: string | null;
  organizationId?: string;

  constructor(data: Project) {
    super(data);

    if (data.id) {
      this.id = data.id;
    }
    this.name = data.name ?? undefined;
    this.description = data.description ?? null;
  }
}

interface ProjectServiceProps {
  organizationId: string;
}

class ProjectService extends FirestoreService<Project> {
  private organizationId: string;

  constructor({ organizationId }: ProjectServiceProps) {
    // console.group("ProjectService");
    // console.log({ organizationId });
    // console.groupEnd();
    super({
      collectionName: `organizations/${organizationId}/projects`,
      DocumentDto: Project,
    });

    this.organizationId = organizationId;
  }

  getAllX = async (organizationId: string) => {
    try {
      const app = getApp();
      const firestore = getFirestore(app);
      const collectionRef = query(
        collection(firestore, `organizations/${organizationId}/projects`)
      );

      const querySnapshot = await getDocs(collectionRef);
      const items: any[] = [];

      querySnapshot.forEach((doc) => {
        const dtoItem = new Project({ ...doc.data(), id: doc.id } as any);
        items.push(dtoItem);
      });

      return { data: items, error: null };
    } catch (error) {
      console.log(error);
      return { data: [], error: true };
    } finally {
      console.groupEnd();
    }
  };
}

export { ProjectService, Project };
