import { useEffect, useMemo, useState } from "react";
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
import { X } from "lucide-react";

import type { UpdateProductDTO } from "@/services/product.service";
import {
  useDeleteProduct,
  useProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useProducts";
import { ProductNativeSelect } from "../ui-d/select";

export default function EditProductCard() {
  // 1) Carrega lista para o select
  const {
    loading: listLoading,
    error: listError,
    data: list,
    refetch,
  } = useProducts();

  // 2) Estado do produto selecionado (id)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // 3) Busca o produto quando selectedId muda
  const {
    loading: itemLoading,
    error: itemError,
    data: product,
    refetch: refetchItem,
  } = useProduct(selectedId);

  // 4) Hooks de mutação
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

  // 5) Form state (controlado)
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>(""); // manter como string no input e converter ao salvar
  const [stock, setStock] = useState<string>("");

  // 6) Sempre que o produto carregar, popular o form
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

  // 7) Helpers de estado
  const isFormDisabled = useMemo(
    () => !selectedId || itemLoading || updating || deleting,
    [selectedId, itemLoading, updating, deleting]
  );

  // 8) Ações
  const handleSave = async () => {
    if (!selectedId) return;

    // Monte o DTO conforme seu backend/service espera.
    // Se o seu service já faz o mapper (camelCase -> snake_case), basta enviar camelCase.
    const payload: UpdateProductDTO = {
      nome: name.trim(),
      descricao: description.trim(),
      preco: Number(price), // converte para número
      estoque: stock ? Number(stock) : undefined,
    };

    await updateProduct(String(selectedId), payload);
    await refetchItem(selectedId); // recarrega o produto após salvar
    await refetch(); // atualiza a lista do select (opcional)
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteProduct(String(selectedId));
    // limpar seleção e form
    setSelectedId(undefined);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    await refetch(); // atualiza a lista
  };

  return (
    <Card className="w-[380px] h-full overflow-hidden shadow-lg border border-gray-200 rounded-xl">
      <CardHeader className="flex justify-between items-top">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Editar Produto
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 pt-2">
            Selecione um produto e altere os dados
          </CardDescription>
        </div>
        <button type="button" aria-label="Fechar">
          <X className="cursor-pointer" />
        </button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SELECT DE PRODUTO */}
        <div className="space-y-1">
          <Label>Selecionar produto</Label>
          <ProductNativeSelect
            id="produto"
            value={selectedId}
            onChange={setSelectedId}
            options={(list ?? []).map((p) => ({
              label: p.nome, // mostra o nome no dropdown
              value: String(p.id), // envia o id como string
            }))}
            placeholder={listLoading ? "Carregando..." : "Escolha um produto"}
            disabled={listLoading}
          />
          {listError && (
            <p className="text-xs text-red-600 pt-1">
              Erro ao carregar produtos: {listError.message}
            </p>
          )}
        </div>

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

        {/* ERROS DO ITEM */}
        {itemError && (
          <p className="text-xs text-red-600">
            Erro ao carregar item: {itemError.message}
          </p>
        )}
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
              disabled={!selectedId || deleting || itemLoading}
              onClick={handleDelete}
            >
              {deleting ? "Excluindo..." : "Excluir anúncio"}
            </Button>
          </div>
          <div className="w-full space-y-1">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white"
              disabled={!selectedId || updating || itemLoading}
              onClick={handleSave}
            >
              {updating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
