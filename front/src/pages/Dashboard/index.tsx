import CreateProductCard from "@/components/CreateProductCard";
import EditProductCard from "@/components/EditProductCard";
import MyProductCard from "@/components/MyProductCard";
import ProductList from "@/components/ProductList";
import TopBar from "@/components/TopBar";

export function Dashboard() {
  return (
    <section className="p-8 space-y-10">
      <TopBar />
      <h1 className="text-3xl font-bold text-gray-800">Painel de Energia</h1>

      <div className="flex flex-wrap gap-8">
        <CreateProductCard />
        <EditProductCard />
        <MyProductCard />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Produtos disponíveis
        </h2>
        <ProductList />
      </div>
    </section>
  );
}
