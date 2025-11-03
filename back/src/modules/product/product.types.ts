import type { Request } from "express";

export interface CreateProductDTO {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
}

export interface UpdateProductDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
}

export interface ProductResponse {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  created_at: Date;
  updated_at: Date;
}

export interface ErrorResponse {
  message: string;
}

export interface AuthenticatedUser {
  id: number;
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  nome?: string;
  minPreco?: number;
  maxPreco?: number;
}

export interface AuthRequest<TParams, TBody>
  extends Request<TParams, unknown, TBody> {
  user: AuthenticatedUser;
}
