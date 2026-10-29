"use client";
import { UserRegisterFormData } from "@/app/schemas/user";
import AuthForm from "@/components/auth-form";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  async function onSubmit(values: UserRegisterFormData): Promise<void> {
    let response: Response
    try {
      response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch {
      throw new Error("Network error - please try again")
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(data?.error ?? "Registration failed")
    }
    
    router.push("/")
  }
  return (
    <div className="from-secondary/70 via-background to-background flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] px-4 py-12">
      <AuthForm mode="signup" onSubmit={onSubmit} />
    </div>
  );
}
