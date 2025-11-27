import { http } from "./http";

export type Product = {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  estoque: number;
  id_usuario: number;
  created_at: string;
  updated_at: string | null;
  usuario?: {
    nome: string;
  };
};

export type CreateProductDTO = {
  nome: string;
  descricao?: string;
  preco: number;
  estoque?: number;
  images?: string[];
  category?: string;
  id_usuario?: number;
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
  nome?: string; 
};

const path = "/products";

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
    return http<Product>(path, { method: "POST", body: data, signal });
  },

  list(signal?: AbortSignal) {
    return http<ListResponse | Product[]>(path, {
      method: "GET",
      signal,
    });
  },

  listFiltered(filters: ProductFilters = {}, signal?: AbortSignal) {
    const qs = toQuery(filters);
    return http<ListResponse | Product[]>(`${path}/filtered${qs}`, {
      method: "GET",
      signal,
    });
  },

  getById(id: string, signal?: AbortSignal) {
    return http<Product>(`${path}/${id}`, { method: "GET", signal });
  },

  update(id: string, data: UpdateProductDTO, signal?: AbortSignal) {
    return http<Product>(`${path}/${id}`, {
      method: "PUT",
      body: data,
      signal,
    });
  },

  delete(id: string, signal?: AbortSignal) {
    return http<void>(`${path}/${id}`, { method: "DELETE", signal });
  },
};