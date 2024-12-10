import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  signOut,
  AuthErrorCodes,
} from "firebase/auth";

import { PromiseResponse } from "types/promiseResponse";

class AuthService {
  constructor() {}

  private getErrorMessage(error: { code: string; message: string }) {
    let errorMessage = "";

    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        errorMessage = "Email already in use";
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        errorMessage = "Weak password";
        break;

      default:
        errorMessage = error.message;
        break;
    }

    const stringsToRemove = ["Firebase:", error.code, "(", ")", " ."];
    stringsToRemove.forEach((stringToRemove) => {
      errorMessage = errorMessage.replace(stringToRemove, "");
    });
    errorMessage = errorMessage.trim();
    console.log({ errorCode: error.code, errorMessage });

    return errorMessage;
  }

  async signUp(signUpForm: {
    email: string;
    password: string;
  }): Promise<PromiseResponse<User>> {
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        signUpForm.email,
        signUpForm.password
      );

      return { data: user, error: null };
    } catch (error) {
      let errorMessage = "error";

      if (error instanceof FirebaseError) {
        errorMessage = this.getErrorMessage(error);
      }

      return { data: null, error: errorMessage };
    }
  }

  async signIn(signInForm: {
    email: string;
    password: string;
  }): Promise<PromiseResponse> {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(
        auth,
        signInForm.email,
        signInForm.password
      );

      return {
        data: null,
        error: null,
      };
    } catch (error) {
      let errorMessage = "error";

      if (error instanceof FirebaseError) {
        errorMessage = this.getErrorMessage(error);
      }

      return { data: null, error: errorMessage };
    }
  }

  async signOut(): Promise<PromiseResponse> {
    try {
      const auth = getAuth();
      await signOut(auth);

      return {
        data: null,
        error: null,
      };
    } catch (error) {
      let errorMessage = "error";

      if (error instanceof FirebaseError) {
        errorMessage = this.getErrorMessage(error);
      }

      return { data: null, error: errorMessage };
    }
  }
}

export default AuthService;
