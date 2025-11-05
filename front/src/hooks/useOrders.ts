import {
  orderService,
  type Order,
  type ListOrderResponse,
  type CreateOrderDTO,
  type UpdateOrderDTO,
} from "@/services/order.service";
import { useCallback, useEffect, useRef, useState } from "react";

type ListState =
  | { loading: true; error: null; data: null }
  | { loading: false; error: Error; data: null }
  | {
      loading: false;
      error: null;
      data: Order[];
      total?: number;
      page?: number;
      pageSize?: number;
    };

function normalizeListPayload(payload: ListOrderResponse | Order[]) {
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

/* 🔹 LISTAR TODOS OS PEDIDOS */
export function useOrders() {
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

    orderService
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

/* 🔹 LISTAR PEDIDOS DE UM USUÁRIO ESPECÍFICO */
export function useUserOrders(userId?: string | number) {
  const abortRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ListState>({
    loading: !!userId,
    error: null,
    data: null,
  });

  const refetch = useCallback(
    (newUserId?: string | number) => {
      const targetId = newUserId ?? userId;
      if (!targetId) return;

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setState({ loading: true, error: null, data: null });

      orderService
        .listByUser(targetId, ctrl.signal)
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
    [userId]
  );

  useEffect(() => {
    if (userId) refetch(userId);
    return () => abortRef.current?.abort();
  }, [userId, refetch]);

  return { ...state, refetch };
}

/* 🔹 GET POR ID */
export function useOrder(id?: string | number) {
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Order | null>(null);

  const refetch = useCallback(
    (newId?: string | number) => {
      const targetId = newId ?? id;
      if (!targetId) return;

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      setError(null);

      orderService
        .getById(targetId, ctrl.signal)
        .then((ord) => setData(ord))
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

/* 🔹 CREATE */
export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (payload: CreateOrderDTO) => {
    setLoading(true);
    setError(null);
    try {
      const created = await orderService.create(payload);
      return created;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, createOrder: mutate };
}

/* 🔹 UPDATE */
export function useUpdateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (id: string | number, payload: UpdateOrderDTO) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await orderService.update(id, payload);
        return updated;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, updateOrder: mutate };
}

/* 🔹 DELETE */
export function useDeleteOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await orderService.delete(id);
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deleteOrder: mutate };
}
