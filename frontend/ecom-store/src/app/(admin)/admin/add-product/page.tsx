"use client";

import { ProductForm } from "@/components/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/app/schemas/product";

export default function AddProductPage() {
  const router = useRouter();

  const onSubmit = async (data: ProductFormData) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product for your store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={onSubmit}
            submitLabel="Add Product"
          />
        </CardContent>
      </Card>
    </div>
  );
}
