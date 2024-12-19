const PATHS = {
  homePath: "/",
  dashboardPath: "/dashboard",
  dashboard: "dashboard",
  newProjectPath: "/dashboard/project/new",
  newProject: "dashboard/project/new",
  project: "dashboard/project",
  newOrganizationPath: "/dashboard/organization/new",
  newOrganization: "dashboard/organization/new",
  newEnv: "new/env",
  signInPath: "/sign-in",
  signIn: "sign-in",
  signUpPath: "/sign-up",
  signUp: "sign-up",
  forgotPasswordPath: "/forgot-password",
  forgotPassword: "forgot-password",
  resetPasswordPath: "/protected/reset-password",
  resetPassword: "forgot-password",
} as const;

export { PATHS };
