import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts"; // ← import your hook
import type { Product } from "@/services/product.service";
import { CircleDollarSign, MapPinIcon } from "lucide-react";
import { useState } from "react";

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

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
    <div className="flex flex-wrap gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="w-[380px] p-4 border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={"/placa-solar.jpg"}
            alt={product.nome}
            className="w-full h-[200px] object-cover rounded-lg border"
          />
          <CardTitle className="text-2xl font-semibold text-gray-800 mt-3">
            {product.nome}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <MapPinIcon className="size-5 text-gray-500" />
            <span className="text-gray-700 text-sm">{"Piracicaba"}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <CircleDollarSign className="size-5 text-gray-500" />
            <span className="text-gray-700 text-sm">
              {product.preco ?? "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline">Ver detalhes</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setSelectedProduct(product)}
            >
              Comprar
            </Button>
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
              <img
                src={"/placa-solar.jpg"}
                alt={selectedProduct.nome}
                className="w-full h-[180px] object-cover rounded-lg border"
              />

              <div>
                <p className="text-gray-700 text-sm">
                  <strong>Local:</strong> {"Piracicaba"}
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
