import CreateProductCard from "@/components/CreateProductCard";
import EditProductCard from "@/components/EditProductCard";
import MyProductCard from "@/components/MyProductCard"
import ProductCard from "@/components/ProductCard";


export function Dashboard() {
  return (
    <section className="p-8">
    <CreateProductCard />
    <EditProductCard />
    <MyProductCard />
    <ProductCard />
    </section>
  )
}
