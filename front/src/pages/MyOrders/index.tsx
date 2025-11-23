import TopBar from "@/components/TopBar";
import MyProducts from "@/components/MyProducts";
import { useUserOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_MAP: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
  PAGO: "Pago",
  CANCELADO: "Cancelado",
};

const PAYMENT_MAP: Record<string, string> = {
  card: "Cartão de Crédito",
  pix: "Pix",
  boleto: "Boleto Bancário",
};

const STATUS_STYLES: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAGO: "bg-green-100 text-green-800 border-green-200",
  CANCELADO: "bg-red-100 text-red-800 border-red-200",
  DEFAULT: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function MyOrders() {
  const { user } = useAuth();
  const {
    loading,
    error,
    data: pedidos,
    refetch,
  } = useUserOrders(user?.id_usuario);

  return (
    <>
      <TopBar />
      <section className="p-8 space-y-10">
        <h1 className="text-3xl font-bold text-gray-800">Meus pedidos</h1>

        {/* Estado de carregamento */}
        {loading && <p>Carregando pedidos...</p>}

        {/* Estado de erro */}
        {error && (
          <p className="text-red-600">
            Erro ao carregar pedidos.{" "}
            <button onClick={() => refetch()} className="underline">
              Tentar novamente
            </button>
          </p>
        )}

        {/* Lista de pedidos */}
        {!loading && !error && pedidos && pedidos.length > 0 ? (
          <MyProducts
            dados={pedidos.map((p) => ({
              id: p.id_pedido,
              status: STATUS_MAP[p.status] || p.status,
              statusColor: STATUS_STYLES[p.status] || STATUS_STYLES.DEFAULT,
              valor: Number(p.valor), // converte string → número, se necessário
              forma: PAYMENT_MAP[p.forma_pagamento] || p.forma_pagamento, // pode vir do backend depois
            }))}
          />
        ) : (
          !loading &&
          !error && <p className="text-gray-500">Nenhum pedido encontrado.</p>
        )}
      </section>
    </>
  );
}
