import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Bell, ShoppingCart, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function TopBar() {
  const { total, items, clearCart } = useCart();
  const [search, setSearch] = useState("");

  return (
    <div className="flex justify-between items-center px-8 py-4 border-b bg-white">
      <h1 className="text-xl font-semibold text-gray-800">Comprar</h1>

      <div className="flex items-center gap-3 w-[50%]">
        <Input
          placeholder="🔍 Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg"
        />

        <Button variant="outline" className="text-gray-700 border-gray-300">
          Ordenar por ▾
        </Button>
        <Button variant="outline" className="text-gray-700 border-gray-300">
          Filtrar ⚙️
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <User className="size-5 text-gray-700 cursor-pointer" />
        <Bell className="size-5 text-gray-700 cursor-pointer" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="relative">
              <ShoppingCart className="size-5 text-gray-700 cursor-pointer" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-1.5 rounded-full">
                  {items.length}
                </span>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[320px] p-0 border border-gray-200 shadow-lg rounded-xl"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Carrinho
              </h2>

              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">Seu carrinho está vazio</p>
              ) : (
                <>
                  <ul className="space-y-3 mb-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x R${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="size-4 text-red-500 hover:text-red-700" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-1/2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Limpar
                    </Button>
                    <Button className="w-1/2 bg-green-600 hover:bg-green-700 text-white">
                      Finalizar compra
                    </Button>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
