import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TopBar from "@/components/TopBar";
import { orderService, type OrderDetails } from "@/services/order.service";
import { Loader2 } from "lucide-react";

const formatDateTimeBr = (dateStr: string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

interface NotaFiscalData {
  nf_numero: string;
  nome_destinatario: string;
  email_destinatario: string;
  endereco_destinatario: string;
  cpf_cnpj_destinatario: string;
  nome_razao_emitente: string;
  cnpj_emitente: string;
  email_emitente: string;
  id_pedido: number;
  created_at: string;
}

export default function NotaFiscal() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [nf, setNf] = useState<NotaFiscalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function loadOrder() {
      try {
        setIsLoading(true);
        setError(null);
        if (!id) return;
        const data = await orderService.getById(id, controller.signal);
        setOrder(data);

        // 🧾 monta os dados da NF a partir do objeto que vem do banco
        const nfData: NotaFiscalData = {
          nf_numero: `NF-${String(data.id_pedido).padStart(6, "0")}`,
          nome_destinatario: data.id_usuario_comprador.nome,
          email_destinatario: data.id_usuario_comprador.email,
          // se o endereço do comprador não vem no objeto, deixe um placeholder
          endereco_destinatario: "Endereço não informado",
          cpf_cnpj_destinatario: data.id_usuario_comprador.cpf_cnpj,
          nome_razao_emitente: data.id_usuario_vendedor.nome,
          cnpj_emitente: data.id_usuario_vendedor.cpf_cnpj,
          email_emitente: data.id_usuario_vendedor.email,
          id_pedido: data.id_pedido,
          created_at: formatDateTimeBr(data.created_at ?? data.data_pedido),
        };

        setNf(nfData);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setError("Erro ao carregar dados da nota fiscal.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !order || !nf) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600">
          {error ?? "Pedido / Nota Fiscal não encontrado."}
        </p>
      </div>
    );
  }

  // helper só pra mostrar os produtos da NF bonitinho
  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(typeof value === "string" ? parseFloat(value) : value);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <TopBar />

        <div className="p-10 max-w-4xl mx-auto bg-white mt-6 rounded-xl shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Nota Fiscal #{nf.nf_numero}
          </h1>

          <div className="space-y-6">
            {/* Informações do Pedido */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Informações do Pedido
              </h2>
              <p>
                <strong>ID do Pedido:</strong> {order.id_pedido}
              </p>
              <p>
                <strong>Emitida em:</strong> {nf.created_at}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Forma de pagamento:</strong> {order.forma_pagamento}
              </p>
              <p>
                <strong>Parcelas:</strong> {order.parcelas}
              </p>
              <p>
                <strong>Valor Total:</strong> {formatCurrency(order.valor)}
              </p>
            </section>

            {/* Emitente */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Emitente
              </h2>
              <p>
                <strong>Nome/Razão Social:</strong> {nf.nome_razao_emitente}
              </p>
              <p>
                <strong>CPF/CNPJ:</strong> {nf.cnpj_emitente}
              </p>
              <p>
                <strong>Email:</strong> {nf.email_emitente}
              </p>
            </section>

            {/* Destinatário */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Destinatário
              </h2>
              <p>
                <strong>Nome:</strong> {nf.nome_destinatario}
              </p>
              <p>
                <strong>Email:</strong> {nf.email_destinatario}
              </p>
              <p>
                <strong>Endereço:</strong> {nf.endereco_destinatario}
              </p>
              <p>
                <strong>CPF/CNPJ:</strong> {nf.cpf_cnpj_destinatario}
              </p>
            </section>

            {/* Produtos da Nota */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Produtos
              </h2>

              {order.produtos.length === 0 ? (
                <p>Nenhum produto vinculado a este pedido.</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2">Produto</th>
                        <th className="text-right px-4 py-2">Qtd.</th>
                        <th className="text-right px-4 py-2">Valor Unitário</th>
                        <th className="text-right px-4 py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.produtos.map((item) => {
                        const unit = parseFloat(item.produto.preco);
                        const subtotal = unit * item.quantidade;

                        return (
                          <tr
                            key={`${item.id_pedido}-${item.id_produto}`}
                            className="border-t"
                          >
                            <td className="px-4 py-2">
                              <div className="font-medium">
                                {item.produto.nome}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.produto.descricao}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.quantidade}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(item.produto.preco)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(subtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <div className="mt-8 flex justify-end">
            <a
              href={`http://localhost:3000/api/notafiscal/${nf.id_pedido}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Baixar PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
