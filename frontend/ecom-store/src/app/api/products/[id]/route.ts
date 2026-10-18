import { NextResponse } from "next/server";
import { ProductCreate, ProductResponse } from "@/lib/types";

const API_URL = process.env.API_URL;

// Get single product from database
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    const res = await fetch(`${API_URL}/products/${productId}`);

    const product = await res.json();

    if (res.status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: res.status }
      );
    }

    return NextResponse.json(product);
  } catch (err) {
    NextResponse.json({ error: err }, { status: 502 });
  }
}

// Delete one product from database
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const productId = Number(id);

  // check for correct ID
  if (!Number.isInteger(productId) || productId <= 0)
    return NextResponse.json({ detail: "Invalid product ID" }, { status: 400 });

  // Send DELETE request
  let res: Response;
  try {
    res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
    });
  } catch {
    return NextResponse.json(
      { detail: "Couldn't delete product" },
      { status: 404 }
    );
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      { detail: data?.detail ?? "Couldn't delete product" },
      { status: res.status }
    );
  }

  // 204 - No body
  return new NextResponse(null, { status: 204 });
}

export interface FastAPIError {
  detail?: string | { msg: string; loc: (string | number)[] }[];
}
// ------UPDATE a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // Get id from params
  const {id} = await params;
  const productId = Number(id)

  
  // check for correct ID
  if (!Number.isInteger(productId) || productId <= 0)
    return NextResponse.json({ detail: "Invalid product ID" }, { status: 400 });

  // Get product from body
  let body: ProductCreate;
  try{
    body = (await request.json()) as ProductCreate;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Send UPDATE request
  let res: Response;
  try{
    res = await fetch(`${API_URL}/products/${productId}`,{
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
  } catch{
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
