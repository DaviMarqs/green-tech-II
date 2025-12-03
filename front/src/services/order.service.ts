import { http } from "./http";

// --- TIPOS ---

export type OrderItem = {
  id: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: string;
  created_at: string;
  updated_at: string | null;
};

export interface OrderUser {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  data_nasc: string;
  created_at: string;
  updated_at: string | null;
  disabled_at: string | null;
  senha: string; 
}

export interface OrderProductItem {
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  produto: {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    estoque: number;
    id_usuario: number;
    created_at: string;
    updated_at: string | null;
  };
}

export interface OrderDetails {
  id_pedido: number;
  data_pedido: string;
  created_at: string;
  updated_at: string | null;
  forma_pagamento: string;
  parcelas: number;
  status: string;
  valor: string;
  id_usuario_comprador: OrderUser;
  id_usuario_vendedor: OrderUser;
  produtos: OrderProductItem[];
}

export type Order = {
  id_pedido: number;
  forma_pagamento: string;
  parcelas?: number;
  total: string;
  valor: number;
  status: string;
  created_at: string;
  updated_at: string | null;
  itens?: OrderItem[];
};

export interface ProductOrderDTO {
  idProduto: number;
  quantidade: number;
}

export type CreateOrderDTO = {
  compradorId: number;
  vendedorId: number;
  formaPagamento: string;
  parcelas?: number;
  produtos: ProductOrderDTO[]; 
};

export type UpdateOrderDTO = Partial<CreateOrderDTO> & {
  status?: string;
};

export type ListOrderResponse = {
  items: Order[];
  total?: number;
  page?: number;
  pageSize?: number;
};

const path = "/orders";

export const orderService = {
  create(data: CreateOrderDTO, signal?: AbortSignal) {
    return http<Order>(path, { method: "POST", body: data, signal });
  },

  list(signal?: AbortSignal) {
    return http<ListOrderResponse | Order[]>(path, {
      method: "GET",
      signal,
    });
  },

  listByUser(userId: string | number, signal?: AbortSignal) {
    return http<ListOrderResponse | Order[]>(`${path}/user/${userId}`, {
      method: "GET",
      signal,
    });
  },

  getById(id: string | number, signal?: AbortSignal) {
    return http<OrderDetails>(`${path}/${id}`, { method: "GET", signal });
  },
  update(id: string | number, data: UpdateOrderDTO, signal?: AbortSignal) {
    return http<Order>(`${path}/${id}`, {
      method: "PUT",
      body: data,
      signal,
    });
  },

  delete(id: string | number, signal?: AbortSignal) {
    return http<void>(`${path}/${id}`, { method: "DELETE", signal });
  },
};
