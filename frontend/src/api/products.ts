import { apiFetch } from "./client";

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  imageUrl?: string | null;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
};

export type UpdateProductInput = CreateProductInput;

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products", {
    requiresAuth: true,
  });
}

export async function createProduct(
  payload: CreateProductInput
): Promise<Product> {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function updateProduct(
  id: number,
  payload: UpdateProductInput
): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}
