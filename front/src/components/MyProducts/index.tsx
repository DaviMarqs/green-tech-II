import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";

interface Pedido {
  id: number;
  status: string;
  statusColor: string;
  valor: number;
  forma: string;
}

interface MyProductsProps {
  dados: Pedido[];
}

export default function MyProducts({ dados }: MyProductsProps) {
  const navigate = useNavigate();

  const handleNotaFiscal = (id: number) => {
    console.log("Abrindo nota fiscal para o pedido:", id);
    navigate(`/nota-fiscal/${id}`);
  };

  const handlePagar = (id: number) => {
    console.log("Pagamento iniciado para o pedido:", id);
    navigate(`/checkout/${id}`);
  };

  return (
    <Table>
      <TableCaption>Fim da lista de pedidos</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[160px]">ID Do pedido</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método de pagamento</TableHead>
          <TableHead className="text-right">Valor (R$)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {dados.map((pedido) => (
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

            <TableCell className="text-right">R$ {pedido.valor}</TableCell>

            <TableCell className="text-right flex gap-2 justify-end">
              {pedido.status === "Pago" && (
                <button
                  onClick={() => handleNotaFiscal(pedido.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Nota Fiscal
                </button>
              )}

              {pedido.status === "Aguardando Pagamento" && (
                <button
                  onClick={() => handlePagar(pedido.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Pagar
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
