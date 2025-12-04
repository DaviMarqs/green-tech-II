import { SuccessModal } from "@/components/SuccessModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { orderService, type CreateOrderDTO } from "@/services/order.service";
import { paymentService, type PaymentMethod } from "@/services/payment.service";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AddressData {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
}

interface CartItemWithSeller {
  id: number;
  quantity: number;
  name: string;
  price: number;
  id_usuario?: number;
  userId?: number;
  vendedorId?: number;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [installments, setInstallments] = useState<number>(1);
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [finalPaymentResult, setFinalPaymentResult] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setAddress(JSON.parse(saved));
    else navigate("/dashboard");

    paymentService
      .getPaymentMethods()
      .then((data) => {
        setPaymentMethods(data);
        if (data.length > 0) {
          setSelectedMethod(data[0]);
          setInstallments(1);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erro ao carregar formas de pagamento.");
      });
  }, [navigate]);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setInstallments(1);
    setIsInstallmentsOpen(false);
  };

  const handleModalClose = (open: boolean) => {
    setIsSuccessOpen(open);
    // Removemos a navegação automática daqui para deixar o usuário copiar o código no modal
    // A navegação ocorre quando ele clica nos botões do SuccessModal
  };

  const handleFinish = async () => {
    if (items.length === 0) return toast.error("Seu carrinho está vazio.");
    if (!user) {
      toast.error("Login necessário.");
      navigate("/login");
      return;
    }
    if (!selectedMethod)
      return toast.error("Selecione uma forma de pagamento.");

    try {
      setLoading(true);

      const cartItems = items as unknown as CartItemWithSeller[];
      const primeiroItem = cartItems[0];
      const vendedorId =
        primeiroItem.id_usuario ??
        primeiroItem.userId ??
        primeiroItem.vendedorId;

      if (!vendedorId) {
        toast.error("Não foi possível identificar o vendedor deste produto.");
        setLoading(false);
        return;
      }

      const temMultiplosVendedores = cartItems.some((item) => {
        const idDono = item.id_usuario ?? item.userId ?? item.vendedorId;
        return idDono !== vendedorId;
      });

      if (temMultiplosVendedores) {
        toast.error("Faça pedidos separados para vendedores diferentes.");
        setLoading(false);
        return;
      }

      const payloadOrder: CreateOrderDTO = {
        compradorId: user.id_usuario,
        vendedorId: vendedorId,
        formaPagamento: selectedMethod.forma_pagamento,
        parcelas: installments,
        produtos: cartItems.map((i) => ({
          idProduto: i.id,
          quantidade: i.quantity,
        })),
      };

      const orderCreated = await orderService.create(payloadOrder);

      if (!orderCreated || !orderCreated.id_pedido) {
        throw new Error("Erro ao obter ID do pedido criado.");
      }

      const payloadPayment = {
        id_pedido: orderCreated.id_pedido,
        metodo_pagamento: selectedMethod.forma_pagamento,
        valor: Number(total),
        parcelas: installments,
      };

      const paymentResult = await paymentService.process(payloadPayment);

      setFinalPaymentResult(paymentResult);
      clearCart();
      localStorage.removeItem("userAddress");

      setIsSuccessOpen(true);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao processar pedido.";
      toast.error(msg);
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
                  <strong>Endereço:</strong> {address.logradouro},{" "}
                  {address.numero} - {address.bairro}
                  <br />
                  <strong>CEP:</strong> {address.cep} - {address.cidade}/
                  {address.estado}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">Endereço não encontrado.</p>
            )}

            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Método de pagamento
            </h2>

            {paymentMethods.length === 0 ? (
              <p className="text-gray-500 italic">Carregando opções...</p>
            ) : (
              /* CORREÇÃO DE LAYOUT: grid-cols-2 forçado para manter 2 por linha */
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id_pagamento}
                    onClick={() => handleMethodChange(method)}
                    variant="outline"
                    className={`h-12 px-2 transition-all border-2 text-sm ${
                      selectedMethod?.id_pagamento === method.id_pagamento
                        ? "border-green-600 bg-green-50 text-green-700 font-bold"
                        : "border-gray-100 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    {method.forma_pagamento}
                  </Button>
                ))}
              </div>
            )}

            {selectedMethod && selectedMethod.parcelamento > 1 && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 relative">
                <label
                  htmlFor="installmentOption"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Opções de Parcelamento
                </label>

                <button
                  type="button"
                  onClick={() => setIsInstallmentsOpen(!isInstallmentsOpen)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white hover:border-green-500 focus:ring-2 focus:ring-green-500 outline-none transition flex justify-between items-center text-left group"
                >
                  <span className="text-gray-700 font-medium">
                    {installments}x de R$ {(total / installments).toFixed(2)}{" "}
                    {installments === 1 ? "(à vista)" : "sem juros"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 group-hover:text-green-600 transition-transform duration-200 ${
                      isInstallmentsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isInstallmentsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsInstallmentsOpen(false)}
                      role="button"
                      tabIndex={-1}
                      aria-label="Fechar menu de parcelas"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setIsInstallmentsOpen(false);
                      }}
                    />
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-20 mt-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      {Array.from(
                        { length: selectedMethod.parcelamento },
                        (_, i) => i + 1
                      ).map((num) => (
                        <li key={num}>
                          <button
                            type="button"
                            onClick={() => {
                              setInstallments(num);
                              setIsInstallmentsOpen(false);
                            }}
                            className={`w-full text-left p-3 transition text-gray-700 hover:bg-green-50 hover:text-green-800 focus:bg-green-50 focus:text-green-800 focus:outline-none ${
                              installments === num
                                ? "bg-green-50 font-semibold text-green-700"
                                : ""
                            }`}
                          >
                            {num}x de R$ {(total / num).toFixed(2)}{" "}
                            {num === 1 ? "(à vista)" : "sem juros"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-1/3 h-11 border-gray-300"
            >
              Voltar
            </Button>
            <Button
              disabled={loading}
              onClick={handleFinish}
              className={`w-3/6 h-11 ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } text-white font-semibold`}
            >
              {loading ? "Processando..." : `Pagar R$ ${total.toFixed(2)}`}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 h-fit">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Resumo do pedido
          </h2>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">Carrinho vazio</p>
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

      <SuccessModal
        open={isSuccessOpen}
        onOpenChange={handleModalClose}
        paymentMethod={selectedMethod?.forma_pagamento || ""}
        paymentData={finalPaymentResult}
      />
    </div>
  );
}
