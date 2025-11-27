import AddressModal from "@/components/AddressModal";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import RemoveProductCartModal from "../RemoveProductCartModal";

export default function CartSummary() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Modais
  const [openAddressModal, setOpenAddressModal] = useState(false);
  
  // Estado para controlar qual item será removido via Modal
  const [itemToRemove, setItemToRemove] = useState<{ id: number; name: string } | null>(null);

  const handleDecreaseQuantity = (id: number, currentQuantity: number, name: string) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      setItemToRemove({ id, name });
    }
  };

  const confirmRemoval = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  return (
    <>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Carrinho</h2>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity, item.name)}
                        aria-label={item.quantity === 1 ? "Remover item" : "Diminuir quantidade"}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="size-4 text-red-500 hover:text-red-800 cursor-pointer" />
                        ) : (
                          <Minus className="size-4 text-red-500 hover:text-red-800" />
                        )}
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="size-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-600">Total do pedido</span>
                <span className="font-bold text-gray-900">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Limpar
                </Button>
                <Button
                  className="flex-[2] bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setOpenAddressModal(true)}
                >
                  Finalizar compra
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddressModal 
        open={openAddressModal} 
        onClose={() => setOpenAddressModal(false)} 
      />

      <RemoveProductCartModal
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemoval}
        itemName={itemToRemove?.name}
      />
    </>
  );
}