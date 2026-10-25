"use client";
import { UserRegisterFormData } from "@/app/schemas/user";
import AuthForm from "@/components/auth-form";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  async function onSubmit(values: UserRegisterFormData): Promise<void> {
    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      console.log(response)
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
  return (
    <div className="from-secondary/70 via-background to-background flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] px-4 py-12">
      <AuthForm mode="signup" onSubmit={onSubmit} />
    </div>
  );
}
