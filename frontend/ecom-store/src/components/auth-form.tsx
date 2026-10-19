"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSignup && password !== confirmation) {
      setMessage("Your passwords don't match. Please check them and try again.");
      return;
    }

    setMessage(
      "Authentication isn't connected yet, so your details haven't been sent."
    );
  }

  return (
    <section className="w-full max-w-md rounded-3xl border bg-card p-7 shadow-xl shadow-foreground/5 sm:p-10">
      <div className="mb-8">
        <p className="text-primary mb-3 text-sm font-semibold tracking-[0.18em] uppercase">
          {isSignup ? "Join the flock" : "Welcome back"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Sign in to your account"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isSignup
            ? "A few details and you’re ready to shop."
            : "Your next favorite find is just around the corner."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor={`${mode}-email`} className="text-sm font-medium">
            Email address
          </label>
          <input
            id={`${mode}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus-visible:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${mode}-password`} className="text-sm font-medium">
            Password
          </label>
          <input
            id={`${mode}-password`}
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="Enter your password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setMessage("");
            }}
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus-visible:ring-2"
          />
        </div>

        {isSignup && (
          <div className="space-y-2">
            <label
              htmlFor="signup-password-confirmation"
              className="text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="signup-password-confirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password again"
              required
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setMessage("");
              }}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus-visible:ring-2"
            />
          </div>
        )}

        {message && (
          <p
            role="alert"
            className="text-destructive rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
          >
            {message}
          </p>
        )}

        <Button type="submit" className="h-12 w-full rounded-xl text-base">
          {isSignup ? "Create account" : "Sign in"}
        </Button>

        <div className="flex items-center gap-4" aria-hidden="true">
          <span className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs uppercase">or</span>
          <span className="bg-border h-px flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-xl text-base"
          onClick={() =>
            setMessage("Google sign-in isn't configured yet.")
          }
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="size-5"
          >
            <path
              fill="#4285F4"
              d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
            />
            <path
              fill="#34A853"
              d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
            />
            <path
              fill="#FBBC05"
              d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
            />
            <path
              fill="#EA4335"
              d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9A19.7 19.7 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
            />
          </svg>
          Continue with Google
        </Button>
      </form>

      <p className="text-muted-foreground mt-7 text-center text-sm">
        {isSignup ? "Already have an account?" : "New to What The Duck?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-foreground font-semibold underline-offset-4 hover:underline"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
