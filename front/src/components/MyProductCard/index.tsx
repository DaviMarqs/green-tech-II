import { useProduct } from "@/hooks/useProducts";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

export default function MyProductCard() {
  const { data: product, loading, error } = useProduct("17");

  return (
    <Card className="w-[536px] overflow-hidden shadow-lg border border-gray-200 rounded-xl p-6">
      <CardTitle className="text-3xl font-semibold text-gray-800">
        {product?.nome}
      </CardTitle>
      <img
        src="/placa-solar-2.png"
        alt="Imagem de produto"
        className="w-full object-cover border border-gray-200 rounded-2xl shadow-md"
      />
      <div>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Detalhes da cota
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          {product?.descricao}
        </CardDescription>
      </div>
      <div className="flex w-full justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Preço por cota
        </CardTitle>
        <CardTitle className="text-xl font-semibold text-gray-800">
          R$ {product?.preco}
        </CardTitle>
      </div>
      <div className="flex w-full justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Cotas disponíveis
        </CardTitle>
        <CardTitle className="text-xl font-semibold text-gray-800">
          {product?.estoque}
        </CardTitle>
      </div>
      <div className="flex justify-end">
        <Button className="w-fit px-16 bg-green-600 hover:bg-green-700 cursor-pointer text-white">
          Editar produto
        </Button>
      </div>
    </Card>
  );
}
