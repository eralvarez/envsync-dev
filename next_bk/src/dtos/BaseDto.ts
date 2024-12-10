import { Timestamp } from "firebase/firestore";

class BaseDto {
  createdAt?: Date | Timestamp | null | undefined;
  updatedAt?: Date | Timestamp | null | undefined;
  deletedAt?: Date | Timestamp | null | undefined;

  constructor(data: any) {
    if (data.createdAt) {
      if (data.createdAt instanceof Timestamp) {
        this.createdAt = data.createdAt.toDate();
      }
    } else {
      this.createdAt = null;
    }

    if (data.updatedAt) {
      if (data.updatedAt instanceof Timestamp) {
        this.updatedAt = data.updatedAt.toDate();
      }
    } else {
      this.updatedAt = null;
    }

    if (data.deletedAt) {
      if (data.deletedAt instanceof Timestamp) {
        this.deletedAt = data.deletedAt.toDate();
      }
    } else {
      this.deletedAt = null;
    }
  }
}

export default BaseDto;
