"use server";

import { encodedRedirect } from "utils/utils";
import { createClient } from "utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PATHS from "constants/paths";
import { ActionResponse } from "types/actionResponse";

const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", PATHS.signUpPath, error.message);
  } else {
    return encodedRedirect(
      "success",
      PATHS.signUpPath,
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

const signInAction = async (formData: {
  email: string;
  password: string;
}): Promise<ActionResponse> => {
  try {
    const { email, password } = formData;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      data: null,
      error,
    };
  } catch (error) {
    console.group("signIn action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      PATHS.forgotPasswordPath,
      "Email is required",
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      PATHS.forgotPasswordPath,
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    PATHS.forgotPasswordPath,
    "Check your email for a link to reset your password.",
  );
};

const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      PATHS.resetPasswordPath,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", PATHS.resetPasswordPath, "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", PATHS.resetPasswordPath, "Password update failed");
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(PATHS.signInPath);
};

export {
  signUpAction,
  signInAction,
  forgotPasswordAction,
  resetPasswordAction,
  signOutAction,
};
