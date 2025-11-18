import ProductList from "@/components/ProductList";
import TopBar from "@/components/TopBar";

export function Dashboard() {
  return (
    <><TopBar />
    <section className="p-8 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Painel de Energia</h1>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Produtos disponíveis
        </h2>
        <ProductList />
        <>
        </>
      </div>
    </section></>
  );
}
