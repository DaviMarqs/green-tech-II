import TopBar from "@/components/TopBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const { id } = useParams();

  const [nf, setNf] = useState<NotaFiscalData | null>(null);

  useEffect(() => {
    // MOCK — depois você troca por API
    setNf({
      nf_numero: "NF-2024-0001",
      nome_destinatario: "João Silva",
      email_destinatario: "joao@email.com",
      endereco_destinatario: "Rua das Flores, 123 - São Paulo/SP",
      cpf_cnpj_destinatario: "123.456.789-00",
      nome_razao_emitente: "GreenTech Soluções Ambientais",
      cnpj_emitente: "12.345.678/0001-99",
      email_emitente: "contato@greentech.com",
      id_pedido: Number(id),
      created_at: "2024-02-18 14:32",
    });
  }, [id]);

  if (!nf) {
    return <p className="p-8">Carregando dados da Nota Fiscal...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">

        {/* TopBar */}
        <TopBar />

        <div className="p-10 max-w-4xl mx-auto bg-white mt-6 rounded-xl shadow-sm border">

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Nota Fiscal #{nf.nf_numero}
          </h1>

          <div className="space-y-6">

            {/* Dados do Pedido */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Informações do Pedido
              </h2>
              <p><strong>ID do Pedido:</strong> {nf.id_pedido}</p>
              <p><strong>Emitida em:</strong> {nf.created_at}</p>
            </section>

            {/* Emitente */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Emitente
              </h2>
              <p><strong>Nome/Razão Social:</strong> {nf.nome_razao_emitente}</p>
              <p><strong>CNPJ:</strong> {nf.cnpj_emitente}</p>
              <p><strong>Email:</strong> {nf.email_emitente}</p>
            </section>

            {/* Destinatário */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Destinatário
              </h2>
              <p><strong>Nome:</strong> {nf.nome_destinatario}</p>
              <p><strong>Email:</strong> {nf.email_destinatario}</p>
              <p><strong>Endereço:</strong> {nf.endereco_destinatario}</p>
              <p><strong>CPF/CNPJ:</strong> {nf.cpf_cnpj_destinatario}</p>
            </section>

          </div>

          <div className="mt-8 flex justify-end">
            <a
              href="/nota-fiscal-exemplo.pdf"
              download
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
