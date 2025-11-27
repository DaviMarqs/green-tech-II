import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/services/product.service";
import { Calendar, CircleDollarSign, User, Package, Zap } from "lucide-react";
import { useState } from "react";

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const { data: products, loading, error, refetch } = useProducts();

  if (loading)
    return (
      <div className="flex justify-center items-center w-full py-10 text-gray-600">
        Carregando produtos...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-red-500">
        <p>Erro ao carregar produtos 😢</p>
        <Button variant="outline" onClick={refetch} className="mt-3">
          Tentar novamente
        </Button>
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="text-center text-gray-600 py-10">
        Nenhum produto disponível no momento.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-4 px-2 sm:px-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="flex flex-col gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-6 border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition relative overflow-hidden"
        >


        {product.estoque == 0 ? (
          <div className="w-full h-2 bg-gray-300 rounded-t-xl absolute top-0 left-0 right-0" />
        ) : (
          <div className="w-full h-2 bg-green-600 rounded-t-xl absolute top-0 left-0 right-0" />
        )}

          {/* Título do card */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2" id="titulo-card">
            {product.estoque == 0 ? (
              <Zap className="size-5 sm:size-6 text-gray-300 shrink-0" />
            ) : (
              <Zap className="size-5 sm:size-6 text-green-500 shrink-0" />
            )}
              
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 line-clamp-2">
                {product.nome}
              </CardTitle>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 md:line-clamp-none">
              {product.descricao}
            </p>
          </div>

          {/* Grid de informações - Responsivo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* ID do vendedor */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <User className="size-4 sm:size-5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-xs sm:text-sm">Vendedor</span>
              </div>
              <div>
                <span className="text-gray-700 text-xs sm:text-sm font-medium truncate block" title={product.usuario?.nome}>
                  {product.usuario?.nome || `ID: ${product.id_usuario}`}
                </span>
              </div>
            </div>

            {/* Preço */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <CircleDollarSign className="size-4 sm:size-5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-xs sm:text-sm">Preço</span>
              </div>
              <div>
                <span className="text-gray-700 text-xs sm:text-sm font-medium">
                  R${product.preco ?? "—"}
                </span>
              </div>
            </div>

            {/* Estoque */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Package className="size-4 sm:size-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 text-xs sm:text-sm">Cotas disponíveis</span>
              </div>
              <div>
                <span className="text-gray-700 text-xs sm:text-sm font-medium">
                  {product.estoque ?? "—"}
                </span>
              </div>
            </div>

            {/* Data de publicação */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Calendar className="size-4 sm:size-5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-xs sm:text-sm">Publicado</span>
              </div>
              <div>
                <span className="text-gray-700 text-xs sm:text-sm font-medium truncate block">
                  {product.created_at && new Date(product.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 md:mt-4">
            <a href={`/details-product/${product.id}`} className="w-full">
              <Button variant="outline" className="w-full text-xs sm:text-sm">
                Ver detalhes
              </Button>
            </a>

            {product.id_usuario !== user?.id_usuario && (
              <Button
                className={product.estoque === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
                onClick={() => setSelectedProduct(product)}
                disabled={product.estoque === 0}
              >
                {product.estoque === 0 ? " Sem estoque" : "Comprar agora"}
              </Button>
            )}
          </div>
        </Card>
      ))}

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
              Comprar {selectedProduct?.nome}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <p className="text-gray-700 text-xs sm:text-sm">
                  {/* 🔥 Alterado no Modal também */}
                  <strong>Vendedor:</strong> {selectedProduct.usuario?.nome || selectedProduct.id_usuario}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm">
                  <strong>Preço:</strong> R${selectedProduct.preco}
                </p>
              </div>


              {selectedProduct.estoque == 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                  <p className="text-red-700 text-xs sm:text-sm font-medium">
                    Produto esgotado no momento.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                  <p className="text-green-700 text-xs sm:text-sm font-medium">
                    Cotas disponíveis: {selectedProduct.estoque}
                  </p>
                </div>
              )}
              <Button
                className={`w-full ${selectedProduct.estoque === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white mt-2 text-xs sm:text-sm`}
                onClick={() => {
                  addToCart({
                    id: selectedProduct.id,
                    name: selectedProduct.nome,
                    price: Number(selectedProduct.preco) || 0,
                    image: "",
                    quantity: 1,
                    id_usuario: selectedProduct.id_usuario,
                  });
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.estoque === 0}
              >
                {selectedProduct.estoque === 0 ? " Indisponível" : "Adicionar ao carrinho"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}