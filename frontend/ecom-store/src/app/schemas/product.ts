import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .transform(Number)
    .pipe(z.number().positive("Price must be greater than 0")),
  image: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(z.string().url("Please enter a valid URL").optional()),
  description: z.string().optional(),
  category: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(z.string().optional()),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormData = z.output<typeof productSchema>;
