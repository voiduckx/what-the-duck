import { NextResponse } from "next/server";
import { FastAPIError, ProductCreate, ProductResponse } from "@/lib/types";


const API_URL = process.env.API_URL;

// Get all products from database
export async function GET(): Promise<NextResponse> {
  // fetch products from FastAPI
  let res: Response;
  try {
    res = await fetch(`${API_URL}/products`);
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  // Parse the response
  const data: ProductResponse[] | FastAPIError | null = await res
    .json()
    .catch(() => null);

  // Forward non OK response
  if (!res.ok) {
    const errorData = data as FastAPIError | null;
    const detail = errorData?.detail;

    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: res.status });
  }

  // success response
  return NextResponse.json(data as ProductResponse[], { status: res.status });
}

// Add a product to database
export async function POST(request: Request): Promise<NextResponse> {
  let body: ProductCreate;
  try {
    // Get fields value from request
    body = (await request.json()) as ProductCreate;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Forward to FastAPI
  let res: Response;
  try {
    // Send POST request to server
    res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  // Parse FastAPI response
  const data: ProductResponse | FastAPIError | null = await res
    .json()
    .catch(() => null);

  // Non OK response
  if (!res.ok) {
    const errorData = data as FastAPIError | null;
    const detail = errorData?.detail;

    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : "Request failed";

    return NextResponse.json({ error: message }, { status: res.status });
  }

  // Success response
  return NextResponse.json(data as ProductResponse, { status: res.status });
}
