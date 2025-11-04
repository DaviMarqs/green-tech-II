import { CircleDollarSign, MapPinIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

export default function ProductCard() {
  return (
    <Card className="w-[424px] gap-3 overflow-hidden shadow-lg border border-gray-200 rounded-xl px-6">
      <img
        src="/placa-solar-2.png"
        alt="Imagem de produto"
        className="w-full h-[284px] object-cover border border-gray-200 rounded-2xl shadow-md"
      />
      <CardTitle className="text-2xl font-semibold text-gray-800">
        SolVerde
      </CardTitle>
      <div className="flex w-full gap-2 items-center">
        <MapPinIcon className="size-6" />
        <CardTitle className="text-lg font-normal text-gray-800">
          São Paulo - SP
        </CardTitle>
      </div>
      <div className="flex w-full gap-2 items-center">
        <CircleDollarSign className="size-6" />
        <CardTitle className="text-lg font-normal text-gray-800">
          R$5,00 por cota
        </CardTitle>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="w-full space-y-1">
          <Button className="w-full bg-neutral-200 hover:bg-neutral-300 cursor-pointer text-neutral-800">
            Ver detalhes
          </Button>
        </div>
        <div className="w-full space-y-1">
          <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white">
            Comprar
          </Button>
        </div>
      </div>
    </Card>
  );
}
