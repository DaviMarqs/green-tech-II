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

  // Fetch products from your API
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
    <div className="flex flex-col gap-6 pt-4 ">

      {products.map((product) => (

        <Card
          key={product.id}
          className="flex flex-col gap-4 w-full p-4 border border-gray-200 shadow-md rounded-l hover:shadow-lg transition cursor-pointer relative"
        >
          {/* Barra verde no topo */}
          <div className="w-full h-2 bg-green-600 rounded-t-xl absolute top-0 left-0 -mb-1 z-10" />
          {/* Estilizando o título do card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2" id="titulo-card">
              <Zap className="size-6 text-green-500" />
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {product.nome}
              </CardTitle>
            </div>
          </div>
          <div>
            <p className="text-gray-700 text-sm">{product.descricao}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1" id="categoria">
              <div className="flex items-center gap-1 mt-1">
                <User className="size-5 text-gray-500" />
                <span className="text-gray-500 text-sm">ID do vendedor: </span>
              </div>
              <div>
                <span className="text-gray-700 text-sm">{product.id_usuario}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1" id="categoria">
              <div className="flex items-center gap-1 mt-1">
                <CircleDollarSign className="size-5 text-gray-500" />
                <span className="text-gray-500 text-sm">Preço</span>
              </div>
              <div>
                <span className="text-gray-700 text-sm">R${product.preco ?? "—"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1" id="categoria">
              <div className="flex items-center gap-1 mt-1">
                <Package className="size-5 text-gray-500" />
                <span className="text-gray-500 text-sm">Estoque</span>
              </div>
              <div>
                <span className="text-gray-700 text-sm">{product.estoque ?? "—"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1" id="categoria">
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="size-5 text-gray-500" />
                <span className="text-gray-500 text-sm">Publicado em</span>
              </div>
              <div>
                <span className="text-gray-700 text-sm">{product.created_at ?? "—"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <a href={`/details-product/${product.id}`}>
                <Button variant="outline">Ver detalhes</Button>
              </a>

              {product.id_usuario !== user?.id_usuario && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setSelectedProduct(product)}
                >
                  Comprar
                </Button>
              )}
            </div>

          </div>
        </Card>
      ))}

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Comprar {selectedProduct?.nome}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  <strong>Vendedor:</strong> {selectedProduct?.id_usuario}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Preço:</strong> {selectedProduct.preco}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-700 text-sm font-medium">
                  Economia estimada: <strong>R$ 150,00/mês</strong>
                </p>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
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
              >
                Adicionar ao carrinho
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
