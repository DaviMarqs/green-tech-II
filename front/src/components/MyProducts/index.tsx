import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 add this
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Pedido {
  id: number;
  status: string;
  statusColor: string;
  valor: number;
  forma: string;
}

interface MyProductsProps {
  dados: Pedido[];
  reloadOrders?: () => void;
}

export default function MyProducts({ dados, reloadOrders }: MyProductsProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const navigate = useNavigate(); // 👈 hook de navegação

  const handleInformarPagamento = async (pedidoId: number) => {
    setLoadingId(pedidoId);

    try {
      await api.patch(`/orders/${pedidoId}/status`, {
        status: "PAGO",
      });

      toast.success(`Pagamento confirmado para o pedido #${pedidoId}`);

      if (reloadOrders) reloadOrders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao atualizar status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleVerDetalhes = (pedidoId: number) => {
    navigate(`/my-orders/${pedidoId}`); // 👈 redireciona para /my-orders/:id
  };

  return (
    <Table>
      <TableCaption>Fim da lista de pedidos</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-40">ID do pedido</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método de pagamento</TableHead>
          <TableHead className="text-right">Valor (R$)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {dados.map((pedido) => {
          const isPaid = pedido.status.toLowerCase() === "pago";

          return (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">{pedido.id}</TableCell>

              <TableCell>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${pedido.statusColor}`}
                >
                  {pedido.status}
                </span>
              </TableCell>

              <TableCell>{pedido.forma}</TableCell>

              <TableCell className="text-right">
                R$ {pedido.valor.toFixed(2)}
              </TableCell>

              <TableCell className="text-right">
                {!isPaid ? (
                  <Button
                    size="sm"
                    onClick={() => handleInformarPagamento(pedido.id)}
                    disabled={loadingId === pedido.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loadingId === pedido.id
                      ? "Processando..."
                      : "Informar pagamento"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() => handleVerDetalhes(pedido.id)} // 👈 aqui
                  >
                    Ver detalhes
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
