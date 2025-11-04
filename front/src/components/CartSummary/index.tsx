import AddressModal from "@/components/AddressModal";
import { useCart } from "@/contexts/CartContext";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CartSummary() {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Carrinho</h2>

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
                    <p className="font-medium">{item.name}</p>
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
                className="w-1/2 text-red-700 border-red-300 hover:bg-red-50"
              >
                Limpar
              </Button>
              <Button
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setOpenModal(true)}
              >
                Finalizar compra
              </Button>
            </div>
          </>
        )}
      </div>

      <AddressModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
