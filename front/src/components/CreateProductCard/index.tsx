import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useCreateProduct } from "@/hooks/useProducts";
import type { CreateProductDTO } from "@/services/product.service";

interface CreateProductCardProps {
  onProductCreated?: () => void;
}

export default function CreateProductCard({
  onProductCreated,
}: CreateProductCardProps) {
  const { loading, error, createProduct } = useCreateProduct();

  // form controlado
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const { user } = useAuth();

  // UI feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
  };

  const handleSubmit = async () => {
    setFormError(null);
    setSuccessMsg(null);

    // validações simples
    if (!name.trim()) return setFormError("Informe o nome do produto.");
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0)
      return setFormError("Informe um preço válido.");
    const stockNum = stock ? Number(stock) : 0;
    if (Number.isNaN(stockNum) || stockNum < 0)
      return setFormError(
        "Informe um valor de cota/estoque válido (0 ou mais)."
      );

    const payload: CreateProductDTO = {
      nome: name.trim(),
      descricao: description.trim(),
      preco: priceNum,
      estoque: stock ? stockNum : undefined,
      id_usuario: user?.id_usuario,
    };

    try {
      await createProduct(payload);
      setSuccessMsg("Produto cadastrado com sucesso!");
      resetForm();

      onProductCreated?.();
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch {
      setFormError("Não foi possível cadastrar. Tente novamente.");
    }
  };

  return (
    <Card className="w-[380px] h-full overflow-hidden shadow-lg border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Cadastrar Cota de Energia
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Preencha os dados do produto abaixo
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {/* mensagens */}
        {formError && <p className="text-xs text-red-600">{formError}</p>}
        {error && (
          <p className="text-xs text-red-600">
            {error.message || "Erro ao cadastrar."}
          </p>
        )}
        {successMsg && <p className="text-xs text-green-700">{successMsg}</p>}

        <div className="space-y-1">
          <Label htmlFor="nome_produto">Nome do Produto</Label>
          <Input
            id="nome_produto"
            placeholder="Ex: Cota de Energia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o produto ou benefício da cota..."
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex: 500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="estoque">Cota (kWh)</Label>
            <Input
              id="estoque"
              type="number"
              inputMode="numeric"
              placeholder="Ex: 200"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white mt-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Produto"}
        </Button>
      </CardContent>
    </Card>
  );
}
