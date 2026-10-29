import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/users/me`, {
      headers: { Cookie: `access_token=${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Not autheticated" }, { status: 401 });
  }

  return NextResponse.json(await res.json(), { status: 200 });
}
