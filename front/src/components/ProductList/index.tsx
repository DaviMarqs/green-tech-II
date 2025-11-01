import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { CircleDollarSign, MapPinIcon } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  city: string;
  price: string;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "SolarNorte",
    city: "Fortaleza - CE",
    price: "R$ 6,00 / kWh",
    image: "/placa-solar.jpg",
  },
  {
    id: 2,
    name: "GreenSun",
    city: "Campinas - SP",
    price: "R$ 5,50 / kWh",
    image: "/placa-solar-2.png",
  },
  {
    id: 3,
    name: "EcoSol",
    city: "Curitiba - PR",
    price: "R$ 5,80 / kWh",
    image: "/placa-solar.jpg",
  },
];

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  return (
    <div className="flex flex-wrap gap-6">
      {mockProducts.map((product) => (
        <Card
          key={product.id}
          className="w-[380px] p-4 border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[200px] object-cover rounded-lg border"
          />
          <CardTitle className="text-2xl font-semibold text-gray-800 mt-3">
            {product.name}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <MapPinIcon className="size-5 text-gray-500" />
            <span className="text-gray-700 text-sm">{product.city}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <CircleDollarSign className="size-5 text-gray-500" />
            <span className="text-gray-700 text-sm">{product.price}</span>
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
              Comprar {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-[180px] object-cover rounded-lg border"
              />

              <div>
                <p className="text-gray-700 text-sm">
                  <strong>Local:</strong> {selectedProduct.city}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Preço:</strong> {selectedProduct.price}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-gray-700">Quantidade (kWh)</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    -
                  </Button>
                  <span className="text-gray-800 font-medium">10</span>
                  <Button variant="outline" size="sm">
                    +
                  </Button>
                </div>
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
                    name: selectedProduct.name,
                    price: 350,
                    quantity: 1,
                    image: selectedProduct.image,
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
