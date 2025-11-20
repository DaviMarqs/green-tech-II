import CreateProductCard from "@/components/CreateProductCard";
import EditProductCard from "@/components/EditProductCard";
import TopBar from "@/components/TopBar";

export function Sell() {
  return (
    <><TopBar /><section className="p-8 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Painel de Energia</h1>

      <div className="flex flex-wrap gap-8">
        <CreateProductCard />
        <EditProductCard />
      </div>
    </section></>
  );
}
