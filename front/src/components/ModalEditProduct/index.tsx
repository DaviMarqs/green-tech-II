import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { UpdateProductDTO } from "@/services/product.service";
import {
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";

interface ModalEditProductProps {
  productId: string;
  onClose?: () => void;
  onSaveSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export default function ModalEditProduct({ 
  productId, 
  onClose,
  onSaveSuccess,
  onDeleteSuccess
}: ModalEditProductProps) {
  // Busca o produto
  const {
    loading: itemLoading,
    error: itemError,
    data: product,
    refetch: refetchItem,
  } = useProduct(productId);

  // Hooks de mutação
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

  // Form state (controlado)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // manter como string no input e converter ao salvar
  const [stock, setStock] = useState("");

  // Sempre que o produto carregar, popular o form
  useEffect(() => {
    if (!product) return;
    setName(product.nome ?? "");
    setDescription(product.descricao ?? "");
    setPrice(
      // garante que o input mostre decimal corretamente
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

  // Helper de estado
  const isFormDisabled = itemLoading || updating || deleting;

  // Ações
  const handleSave = async () => {
    if (!productId) return;

    // Monte o DTO conforme seu backend/service espera.
    const payload: UpdateProductDTO = {
      nome: name.trim(),
      descricao: description.trim(),
      preco: Number(price), // converte para número
      estoque: stock ? Number(stock) : undefined,
    };

    await updateProduct(String(productId), payload);
    await refetchItem(productId); // recarrega o produto após salvar

    refetchItem(productId);
    onSaveSuccess?.();
    onClose?.();
  };

  const handleDelete = async () => {
    if (!productId) return;
    
    // Confirmação antes de excluir
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    await deleteProduct(String(productId));
    onDeleteSuccess?.();
    onClose?.();
  };

  // Função de cancelar
  const handleCancel = () => {
    onClose?.();
  };

  if (itemLoading) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Produto
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 pt-2">
            Selecione um produto e altere os dados
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Carregando produto...</p>
        </div>
      </>
    );
  }

  if (itemError) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Produto
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 pt-2">
            Selecione um produto e altere os dados
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-xs text-red-600">
            Erro ao carregar item: {itemError.message}
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Fechar
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-gray-800">
          Editar Produto
        </DialogTitle>
        <DialogDescription className="text-xs text-gray-500 pt-2">
          Altere os dados do produto
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* FORMULÁRIO */}
        <div className="space-y-1">
          <Label htmlFor="nome_produto">Nome do Produto</Label>
          <Input
            id="nome_produto"
            placeholder="Ex: Cota de Energia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o produto..."
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isFormDisabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              placeholder="Ex: 500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="estoque">Estoque</Label>
            <Input
              id="estoque"
              type="number"
              placeholder="Ex: 10"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* ERROS */}
        {updateError && (
          <p className="text-xs text-red-600">
            Erro ao salvar: {updateError.message}
          </p>
        )}
        {deleteError && (
          <p className="text-xs text-red-600">
            Erro ao excluir: {deleteError.message}
          </p>
        )}

        {/* AÇÕES */}
        <div className="grid grid-cols-2 gap-3">
          <div className="w-full space-y-1">
            <Button
              className="w-full bg-red-100 hover:bg-red-200 cursor-pointer text-red-900"
              disabled={deleting || itemLoading}
              onClick={handleDelete}
            >
              {deleting ? "Excluindo..." : "Excluir anúncio"}
            </Button>
          </div>
          <div className="w-full space-y-1">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white"
              disabled={updating || itemLoading}
              onClick={handleSave}
            >
              {updating ? "Salvando..." : "Salvar alterações"}
              
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}