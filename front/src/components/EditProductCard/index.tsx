import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";

import {
  useDeleteProduct,
  useProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useProducts";
import type { UpdateProductDTO } from "@/services/product.service";

interface EditProductCardProps {
  onClose?: () => void;
  productId?: string;
}

export default function EditProductCard({
  onClose,
  productId,
}: EditProductCardProps) {
  const {
    loading: listLoading,
    error: listError,
    data: list,
    refetch,
  } = useProducts();

  const [selectedId, setSelectedId] = useState<string | undefined>(productId);

  const {
    loading: itemLoading,
    error: itemError,
    data: product,
    refetch: refetchItem,
  } = useProduct(selectedId);

  const {
    loading: updating,
    error: updateError,
    updateProduct,
  } = useUpdateProduct();
  const {
    loading: deleting,
    error: deleteError,
    deleteProduct,
  } = useDeleteProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");

  useEffect(() => {
    if (!product) return;
    setName(product.nome ?? "");
    setDescription(product.descricao ?? "");
    setPrice(
      typeof product.preco === "number"
        ? String(product.preco)
        : product.preco ?? ""
    );
    setStock(
      typeof product.estoque === "number"
        ? String(product.estoque)
        : product.estoque
        ? String(product.estoque)
        : ""
    );
  }, [product]);

  const isFormDisabled = useMemo(
    () => !selectedId || itemLoading || updating || deleting,
    [selectedId, itemLoading, updating, deleting]
  );

  const handleSave = async () => {
    if (!selectedId) return;

    const payload: UpdateProductDTO = {
      nome: name.trim(),
      descricao: description.trim(),
      preco: Number(price),
      estoque: stock ? Number(stock) : undefined,
    };

    await updateProduct(String(selectedId), payload);
    await refetchItem(selectedId);
    await refetch();

    onClose?.();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteProduct(String(selectedId));
    setSelectedId(undefined);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    await refetch();
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        {listError && (
          <p className="text-xs text-red-600">
            Erro ao carregar produtos: {listError.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="nome_produto"
          className="text-sm font-semibold text-gray-700"
        >
          Nome do Produto
        </Label>
        <Input
          id="nome_produto"
          placeholder="Ex: Cota de Energia"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isFormDisabled}
          className="bg-gray-50 border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="descricao"
          className="text-sm font-semibold text-gray-700"
        >
          Descrição
        </Label>
        <Textarea
          id="descricao"
          placeholder="Descreva o produto..."
          className="resize-none bg-gray-50 border-gray-300 min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isFormDisabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label
            htmlFor="preco"
            className="text-sm font-semibold text-gray-700"
          >
            Preço (R$)
          </Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            placeholder="Ex: 500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isFormDisabled}
            className="bg-gray-50 border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="estoque"
            className="text-sm font-semibold text-gray-700"
          >
            Cota (kWh)
          </Label>
          <Input
            id="estoque"
            type="number"
            placeholder="Ex: 10"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            disabled={isFormDisabled}
            className="bg-gray-50 border-gray-300"
          />
        </div>
      </div>

      {itemError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">
            Erro ao carregar item: {itemError.message}
          </p>
        </div>
      )}
      {updateError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">
            Erro ao salvar: {updateError.message}
          </p>
        </div>
      )}
      {deleteError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">
            Erro ao excluir: {deleteError.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          variant="destructive"
          disabled={!selectedId || deleting || itemLoading}
          onClick={handleDelete}
          className="w-full"
        >
          {deleting ? "Excluindo..." : "Excluir"}
        </Button>
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!selectedId || updating || itemLoading}
          onClick={handleSave}
        >
          {updating ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
