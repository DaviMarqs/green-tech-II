import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProducts";
import { useParams } from "react-router-dom";

export default function DetailsProduct() {
  const { id } = useParams<{ id: string }>();
  const { data: product, loading, error } = useProduct(id);
  const { addToCart } = useCart();

  return (
    <div className="w-[1280px]">

      <TopBar />

      <section className="p-8 space-y-10 w-1/2">
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl">Detalhes do produto</h3>
            <h2 className="text-4xl font-semibold">{product?.nome}</h2>
          </div>
          <img
            src="/placa-solar-2.png"
            alt="Imagem de produto"
            className="w-full mt-4 h-[284px] object-cover border border-gray-200 rounded-2xl shadow-md" />
          <div className="my-4">
            <h3 className="text-2xl font-medium">Descrição do produto</h3>
            <h4 className="mt-1 text-md">{product?.descricao}</h4>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between py-4">
              <h3>Valor da cota:</h3>
              <h4 className="font-semibold">R${product?.preco}</h4>
            </div>
            <div className="flex justify-between py-4 border-y">
              <h3>Estoque disponível</h3>
              <h4 className="font-semibold">{product?.estoque}</h4>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
          onClick={() => {
            addToCart({
              id: product?.id || 0,
              name: product?.nome || "",
              image: "",
              price: Number(product?.preco) || 0,
              quantity: 1,
            });
          }}
        >
          Adicionar ao carrinho
        </Button>
      </section>
    </ div>
  );
}
