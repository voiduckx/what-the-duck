"use client";
import { UserRegisterFormData } from "@/app/schemas/user";
import AuthForm from "@/components/auth-form";

export default function SignupPage() {
  async function onSubmit(values: UserRegisterFormData): Promise<void> {
    // just want to see the values for now
    console.log(values);
  }
  return (
    <div className="from-secondary/70 via-background to-background flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] px-4 py-12">
      <AuthForm mode="signup" onSubmit={onSubmit} />
    </div>
  );
}
