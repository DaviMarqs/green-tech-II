import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Pedido {
  id: number;
  status: string;
  valor: number;
  forma: string;
}

interface MyProductsProps {
  dados: Pedido[];
}

export default function MyProducts({ dados }: MyProductsProps) {
    return (
        <Table>
          <TableCaption>Fim da lista de pedidos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">ID Do pedido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método de pagamento</TableHead>
              <TableHead className="text-right">Valor (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">{pedido.id}</TableCell>
                <TableCell>{pedido.status}</TableCell>
                <TableCell>{pedido.forma}</TableCell>
                <TableCell className="text-right">R${pedido.valor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}