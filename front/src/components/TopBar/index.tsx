import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Bell, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import CartSummary from "../CartSummary";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function TopBar() {
  const { items } = useCart();
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
            <CartSummary />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
