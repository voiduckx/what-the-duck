import { UserRegisterFormData } from "@/app/schemas/user";
import { FastAPIError } from "@/lib/types";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

// Register user
export async function POST(request: Request): Promise<NextResponse> {
  let body: UserRegisterFormData;
  try {
    // Get values from request
    body = (await request.json()) as UserRegisterFormData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = {
    email: body.email,
    password: body.password,
    password_confirmation: body.passwordConfirmation
  }

  // Forward to FastAPI
  let res: Response;
  try {
    res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  // Parse backend response
  const data: UserRegisterFormData | FastAPIError | null = await res
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
  const response = NextResponse.json(data as UserRegisterFormData, {status: res.status})

  // set-cookie is comming from FastAPI and contains access_token
  const setCookie = res.headers.get("set-cookie")
  if(setCookie) response.headers.set("set-cookie", setCookie)
  
  return response
}
