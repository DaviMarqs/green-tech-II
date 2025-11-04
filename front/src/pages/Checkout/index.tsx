import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AddressData {
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [payment, setPayment] = useState("pix");
  const [address, setAddress] = useState<AddressData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setAddress(JSON.parse(saved));
    else navigate("/dashboard");
  }, [navigate]);

  const handleFinish = () => {
    toast.success("Compra finalizada com sucesso!");
    clearCart();
    localStorage.removeItem("userAddress");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Confirme seus dados
            </h1>

            {address ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Endereço:</strong> {address.rua}, {address.numero} -{" "}
                  {address.bairro}
                  <br />
                  <strong>CEP:</strong> {address.cep}
                  <br />
                  <strong>Cidade:</strong> {address.cidade} - {address.estado}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">
                Nenhum endereço encontrado. Volte e preencha o endereço.
              </p>
            )}

            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Método de pagamento
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => setPayment("pix")}
                className={`h-12 rounded-lg font-medium transition ${
                  payment === "pix"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Pix
              </Button>
              <Button
                onClick={() => setPayment("card")}
                className={`h-12 rounded-lg font-medium transition ${
                  payment === "card"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Cartão
              </Button>
              <Button
                onClick={() => setPayment("boleto")}
                className={`h-12 rounded-lg font-medium transition ${
                  payment === "boleto"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Boleto
              </Button>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-1/3 h-11 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Voltar
            </Button>
            <Button
              onClick={handleFinish}
              className="w-3/6 h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Finalizar compra →
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Resumo do pedido
          </h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum item no carrinho</p>
          ) : (
            <ul className="divide-y divide-gray-200 mb-6">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-3 text-gray-700"
                >
                  <span className="font-medium">{item.name}</span>
                  <span>
                    {item.quantity}x <strong>R${item.price.toFixed(2)}</strong>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-4">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            {payment === "pix" && (
              <p className="text-sm text-green-800">
                💡 Pagando com <strong>Pix</strong> você garante confirmação
                instantânea do pagamento e começa a receber energia mais rápido!
              </p>
            )}
            {payment === "card" && (
              <p className="text-sm text-green-800">
                💳 Pagamento com <strong>Cartão</strong> permite parcelar sua
                compra em até 12x sem juros.
              </p>
            )}
            {payment === "boleto" && (
              <p className="text-sm text-green-800">
                🧾 Pague via <strong>Boleto</strong> e sua compra será
                confirmada após compensação bancária.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
