import { http } from "./http";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  category?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductDTO = {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  category?: string;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export type ListResponse = {
  items: Product[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  // Adicione o que seu /filtered aceitar
};

function toQuery(params: Record<string, any>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    search.append(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : "";
}

export const productService = {
  create(data: CreateProductDTO, signal?: AbortSignal) {
    return http<Product>("/product", { method: "POST", body: data, signal });
  },

  list(signal?: AbortSignal) {
    return http<ListResponse | Product[]>("/product", {
      method: "GET",
      signal,
    });
  },

  listFiltered(filters: ProductFilters = {}, signal?: AbortSignal) {
    const qs = toQuery(filters);
    return http<ListResponse | Product[]>(`/product/filtered${qs}`, {
      method: "GET",
      signal,
    });
  },

  getById(id: string, signal?: AbortSignal) {
    return http<Product>(`/product/${id}`, { method: "GET", signal });
  },

  update(id: string, data: UpdateProductDTO, signal?: AbortSignal) {
    return http<Product>(`/product/${id}`, {
      method: "PUT",
      body: data,
      signal,
    });
  },

  delete(id: string, signal?: AbortSignal) {
    return http<void>(`/product/${id}`, { method: "DELETE", signal });
  },
};
