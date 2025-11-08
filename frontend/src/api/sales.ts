import { apiFetch } from "./client.js";

export type SaleItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Sale = {
  id: number;
  saleDate: string;
  total: number;
  saleItems: SaleItem[];
};

export type CreateSaleItem = {
  productId: number;
  quantity: number;
};

export type CreateSaleRequest = {
  saleDate: string;
  saleItems: CreateSaleItem[];
};

export type SalesReport = {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalRevenue: number;
  sales: Sale[];
};

export async function getSales(): Promise<Sale[]> {
  return apiFetch<Sale[]>("/api/sales", {
    requiresAuth: true,
  });
}

export async function getSaleById(id: number): Promise<Sale> {
  return apiFetch<Sale>(`/api/sales/${id}`, {
    requiresAuth: true,
  });
}

export async function createSale(payload: CreateSaleRequest): Promise<Sale> {
  return apiFetch<Sale>("/api/sales", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function deleteSale(id: number): Promise<void> {
  await apiFetch<void>(`/api/sales/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}

export async function getSalesReport(
  startDate: string,
  endDate: string
): Promise<SalesReport> {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  return apiFetch<SalesReport>(`/api/sales/report?${params}`, {
    requiresAuth: true,
  });
}

