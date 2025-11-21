import TopBar from "../../components/TopBar";

export default function NotaFiscalF() {
    const nf = {
        nf_numero: "NF-12345",
        nome_destinatario: "João da Silva",
        email_destinatario: "joao@email.com",
        endereco_destinatario: "Rua das Flores, 123 – São Paulo",
        cpf_cnpj_destinatario: "123.456.789-00",
        nome_razao_emitente: "GreenTech Solar LTDA",
        cnpj_emitente: "12.345.678/0001-90",
        email_emitente: "contato@greentech.com",
        id_pedido: "987654",
        created_at: "2024-08-18 14:32",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            <TopBar />

            <div className="flex-1 flex justify-center">
                <div className="p-10 w-full max-w-3xl bg-white mt-8 rounded-xl shadow-sm border">

                    <h1 className="text-3xl font-bold mb-8">
                        Nota Fiscal <span className="text-green-600">#{nf.nf_numero}</span>
                    </h1>
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Dados do Destinatário</h2>
                        <p><strong>Nome:</strong> {nf.nome_destinatario}</p>
                        <p><strong>Email:</strong> {nf.email_destinatario}</p>
                        <p><strong>Endereço:</strong> {nf.endereco_destinatario}</p>
                        <p><strong>CPF/CNPJ:</strong> {nf.cpf_cnpj_destinatario}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Dados do Emitente</h2>
                        <p><strong>Razão Social:</strong> {nf.nome_razao_emitente}</p>
                        <p><strong>CNPJ:</strong> {nf.cnpj_emitente}</p>
                        <p><strong>Email:</strong> {nf.email_emitente}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Dados do Pedido</h2>
                        <p><strong>ID do Pedido:</strong> {nf.id_pedido}</p>
                        <p><strong>Data de Emissão:</strong> {nf.created_at}</p>
                    </section>

                    <button
                        onClick={() => alert("Baixar PDF!")}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Download PDF
                    </button>

                </div>
            </div>

        </div>
    );
}
