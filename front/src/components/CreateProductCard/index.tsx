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

export default function CreateProductCard() {
  return (
    <Card className="w-[380px] overflow-hidden shadow-lg border border-gray-200 rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Cadastrar Cota de Energia
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Preencha os dados do produto abaixo
        </CardDescription>
      </CardHeader>

      <div className="px-4">
        <img
          src="public/placa-solar.jpg"
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
            <Label htmlFor="estoque">Estoque</Label>
            <Input id="estoque" type="number" placeholder="Ex: 20" />
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white mt-2">
          Cadastrar Produto
        </Button>
      </CardContent>
    </Card>
  );
}
