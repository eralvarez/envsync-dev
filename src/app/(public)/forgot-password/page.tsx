import { forgotPasswordAction } from "actions/auth";
// import { FormMessage, Message } from "@/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { input } from "@/components/ui/input";
// import { label } from "@/components/ui/label";
import Link from "next/link";
// import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<any>;
}) {
  // const searchParams = await props.searchParams;
  return (
    <>
      <form
        action={forgotPasswordAction}
        className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto"
      >
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="you@example.com" required />
          <button type="submit">Reset Password</button>
          {/* <FormMessage message={searchParams} /> */}
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
