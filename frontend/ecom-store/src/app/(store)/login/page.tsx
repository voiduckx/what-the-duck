"use client"
import { UserLoginFormData } from "@/app/schemas/user";
import AuthForm from "@/components/auth-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function onSubmit(values: UserLoginFormData): Promise<void> {
    let response: Response;
    try {
      response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch {
      throw new Error("Network error - please try again");
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error ?? "Login failed");
    }

    router.push("/");
  }
  return (
    <div className="from-secondary/70 via-background to-background flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] px-4 py-12">
      <AuthForm mode="login" onSubmit={onSubmit} />
    </div>
  );
}
