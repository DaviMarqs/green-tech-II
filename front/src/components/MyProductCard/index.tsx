import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

export default function MyProductCard() {
    return (
        <Card className="w-[536px] overflow-hidden shadow-lg border border-gray-200 rounded-xl p-6">
            <CardTitle className="text-3xl font-semibold text-gray-800">
                SolarNorte
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
                    Ao garantir sua cota, você não está apenas comprando créditos para ter um belo desconto na sua conta de luz. Você está investindo em uma iniciativa local, que gera empregos na nossa comunidade.
                </CardDescription>
            </div>
            <div className="flex w-full justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Preço por cota
                </CardTitle>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    R$24,50
                </CardTitle>
            </div>
            <div className="flex w-full justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Cotas disponíveis
                </CardTitle>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    5.000
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