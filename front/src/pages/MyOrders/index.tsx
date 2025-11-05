import TopBar from "@/components/TopBar";
import MyProducts from "@/components/MyProducts";
import { useUserOrders } from "@/hooks/useOrders"; // ⬅️ importa o hook
import { useAuth } from "@/contexts/AuthContext";

export default function MyOrders() {
  // 🔹 Hook com ID fixo (pode vir de contexto futuramente)
  const { user } = useAuth();
  const {
    loading,
    error,
    data: pedidos,
    refetch,
  } = useUserOrders(user?.id_usuario);

  console.log("pedidos", pedidos);
  return (
    <section className="p-8 space-y-10">
      <TopBar />
      <h1 className="text-3xl font-bold text-gray-800">Meus pedidos</h1>

      {/* Estado de carregamento */}
      {loading && <p>Carregando pedidos...</p>}

      {/* Estado de erro */}
      {error && (
        <p className="text-red-600">
          Erro ao carregar pedidos.{" "}
          <button onClick={refetch} className="underline">
            Tentar novamente
          </button>
        </p>
      )}

      {/* Lista de pedidos */}
      {!loading && !error && pedidos && pedidos.length > 0 ? (
        <MyProducts
          dados={pedidos.map((p) => ({
            id: p.id_pedido,
            status: p.status,
            valor: Number(p.valor), // converte string → número, se necessário
            forma: p.forma_pagamento, // pode vir do backend depois
          }))}
        />
      ) : (
        !loading &&
        !error && <p className="text-gray-500">Nenhum pedido encontrado.</p>
      )}
    </section>
  );
}
