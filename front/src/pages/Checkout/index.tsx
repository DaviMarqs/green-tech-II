import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import api from "@/lib/api";
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
  const { user } = useAuth();
  const [payment, setPayment] = useState("pix");
  const [address, setAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setAddress(JSON.parse(saved));
    else navigate("/dashboard");
  }, [navigate]);

  const handleFinish = async () => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const compradorId = user.id_usuario;

      const payload = {
        compradorId,
        id_usuario: user.id_usuario,
        formaPagamento: payment,
        produtos: items.map((i) => ({
          idProduto: i.id,
          quantidade: i.quantity,
        })),
      };

      const response = await api.post("/orders", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Pedido criado com sucesso!");
        clearCart();
        localStorage.removeItem("userAddress");
        navigate("/my-orders");
      } else {
        toast.error("Erro ao criar o pedido. Tente novamente.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Não foi possível concluir a compra. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              onClick={handleFinish}
              className={`w-3/6 h-11 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-semibold`}
            >
              {loading ? "Processando..." : "Finalizar compra →"}
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
        </div>
      </div>
    </div>
  );
}
