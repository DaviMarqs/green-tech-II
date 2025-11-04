import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

export default function EditProductCard() {
  return (
    <Card className="w-[380px] overflow-hidden shadow-lg border border-gray-200 rounded-xl">
      <CardHeader className="flex justify-between items-top">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Editar Cota de Energia
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 pt-2">
            Altere os dados do seu produto
          </CardDescription>
        </div>
        <button>
          <X className="cursor-pointer"/>
        </button>
      </CardHeader>

      <div className="px-4">
        <img
          src="/placa-solar.jpg"
          alt="Imagem de produto"
          className="w-full h-40 object-cover border border-gray-200 rounded-md shadow-md"
        />
      </div>

      <CardContent className="pt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="nome_produto">Nome do Produto</Label>
          <Input id="nome_produto" placeholder="Ex: Cota de Energia" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o produto ou benefício da cota..."
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input id="preco" type="number" placeholder="Ex: 500" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="estoque">Cota (kWh)</Label>
            <Input id="estoque" type="number" placeholder="Ex: 200kWh" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="w-full space-y-1">
        <Button className="w-full bg-red-100 hover:bg-red-200 cursor-pointer text-red-900">
          Excluir anúncio
        </Button>
          </div>
          <div className="w-full space-y-1">
        <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white">
          Salvar alterações
        </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
