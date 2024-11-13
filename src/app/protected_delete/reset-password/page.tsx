import { resetPasswordAction } from "actions/auth";
// import { FormMessage, Message } from "@/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { input } from "@/components/ui/input";
// import { label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<any>;
}) {
  // const searchParams = await props.searchParams;
  return (
    <form
      className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4"
      action={resetPasswordAction}
    >
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <label htmlFor="password">New password</label>
      <input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <button type="submit">Reset password</button>
      {/* <FormMessage message={searchParams} /> */}
    </form>
  );
}
