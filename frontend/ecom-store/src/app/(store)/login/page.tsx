import AuthForm from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/70 via-background to-background px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
