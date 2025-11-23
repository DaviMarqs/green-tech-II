import {
  productService,
  type CreateProductDTO,
  type ListResponse,
  type Product,
  type ProductFilters,
  type UpdateProductDTO,
} from "@/services/product.service";
import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";

type ListState =
  | { loading: true; error: null; data: null }
  | { loading: false; error: Error; data: null }
  | {
      loading: false;
      error: null;
      data: Product[];
      total?: number;
      page?: number;
      pageSize?: number;
    };

function normalizeListPayload(payload: ListResponse | Product[]) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: undefined,
      page: undefined,
      pageSize: undefined,
    };
  }
  return {
    items: payload.items,
    total: payload.total,
    page: payload.page,
    pageSize: payload.pageSize,
  };
}

// LISTAR TODOS
export function useProducts() {
  const abortRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ListState>({
    loading: true,
    error: null,
    data: null,
  });

  const refetch = useCallback(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setState({ loading: true, error: null, data: null });

    productService
      .list(ctrl.signal)
      .then((payload) => {
        const { items, total, page, pageSize } = normalizeListPayload(payload);
        setState({
          loading: false,
          error: null,
          data: items,
          total,
          page,
          pageSize,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ loading: false, error: err as Error, data: null });
      });
  }, []);

  useEffect(() => {
    refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

  return { ...state, refetch };
}

// LISTA FILTRADA
export function useFilteredProducts(initialFilters: ProductFilters = {}) {
  const abortRef = useRef<AbortController | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [state, setState] = useState<ListState>({
    loading: true,
    error: null,
    data: null,
  });

  const refetch = useCallback(
    (override?: Partial<ProductFilters>) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const merged = { ...filters, ...(override ?? {}) };
      setFilters(merged);
      setState({ loading: true, error: null, data: null });

      productService
        .listFiltered(merged, ctrl.signal)
        .then((payload) => {
          const { items, total, page, pageSize } =
            normalizeListPayload(payload);
          setState({
            loading: false,
            error: null,
            data: items,
            total,
            page,
            pageSize,
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setState({ loading: false, error: err as Error, data: null });
        });
    },
    [filters]
  );

  useEffect(() => {
    refetch();
    return () => abortRef.current?.abort();
  }, []); // inicial

  return { ...state, filters, setFilters, refetch };
}

// GET POR ID
export function useProduct(id?: string) {
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Product | null>(null);

  const refetch = useCallback(
    (newId?: string) => {
      const targetId = newId ?? id;
      if (!targetId) return;

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      setError(null);

      productService
        .getById(targetId, ctrl.signal)
        .then((prod) => setData(prod))
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError(err as Error);
        })
        .finally(() => setLoading(false));
    },
    [id]
  );

  useEffect(() => {
    if (id) refetch(id);
    return () => abortRef.current?.abort();
  }, [id, refetch]);

  return { loading, error, data, refetch };
}

// CREATE
export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  const mutate = useCallback(async (payload: CreateProductDTO) => {
    setLoading(true);
    setError(null);
    try {
      const created = await productService.create({
        ...payload,
        id_usuario: user?.id_usuario,
      });
      return created;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, createProduct: mutate };
}

// UPDATE
export function useUpdateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string, payload: UpdateProductDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await productService.update(id, payload);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, updateProduct: mutate };
}

// DELETE
export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await productService.delete(id);
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deleteProduct: mutate };
}
