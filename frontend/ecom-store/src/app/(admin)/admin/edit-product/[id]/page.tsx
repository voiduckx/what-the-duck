"use client";

import { Product } from "@/lib/types";
import { ProductForm } from "@/components/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductFormData } from "@/app/schemas/product";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.log("Somehting went wrong");
        }
      } catch {
        console.log("Somehting went wrong");
      }
    }
    fetchProduct();
  }, [params.id]);

  async function onSubmit(data: ProductFormData) {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/admin/products");
      } else {
        console.log("Failed to update product", await response.json());
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading product...</div>
        </div>
      </div>
    );
  }
  const { id, ...initialValues } = product;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit {id}: {product.title}
        </h1>
        <p className="text-muted-foreground">Edit a product.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            initial={initialValues}
            onSubmit={onSubmit}
            submitLabel="Update Product"
          />
        </CardContent>
      </Card>
    </div>
  );
}
