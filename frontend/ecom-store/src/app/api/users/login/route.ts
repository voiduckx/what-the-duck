import { UserLoginFormData } from "@/app/schemas/user";
import { FastAPIError } from "@/lib/types";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

// Login user
export async function POST(request: Request): Promise<NextResponse> {
  let body: UserLoginFormData;
  try {
    // Get values from request
    body = (await request.json()) as UserLoginFormData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = {
    email: body.email,
    password: body.password,
  }

  // Forward to FastAPI
  let res: Response;
  try {
    res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  // Parse backend response
  const data: UserLoginFormData | FastAPIError | null = await res
    .json()
    .catch(() => null);

  // Failed response
  if (!res.ok) {
    const errorData = data as FastAPIError | null;

    const detail = errorData?.detail;

    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : "Request failed";
    
    return NextResponse.json({error: message}, {status: res.status})
  }

  // success
  return NextResponse.json(data as UserLoginFormData, {status: res.status})
}
