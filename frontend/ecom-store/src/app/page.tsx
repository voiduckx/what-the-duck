import { Product } from "@/lib/types";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import Image from "next/image";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/products`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="w-full md:max-w-xl">
                <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                  Welcome to <span className="text-primary">Ducky Shop</span>
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-xl md:mx-0">
                  Discover amazing products at unbeatable prices.{" "}
                  <span className="text-2xl text-green-300">
                    This is Ducking Amazing.
                  </span>
                </p>
              </div>
              <section className="flex w-full justify-center md:w-auto md:justify-end">
                <Image
                  src="/hero-duck.png"
                  height={520}
                  width={520}
                  alt="Hero duck"
                  className="h-auto w-full max-w-[520px] object-contain"
                />
              </section>
            </div>

            <div className="mb-8">
              <h2 className="mb-6 text-3xl font-bold">Featured Products</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {products.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No products available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
