import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function AddressModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cep: "",
    estado: "",
    cidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Endereço enviado:", formData);
    toast.success("Endereço salvo com sucesso!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Insira seu endereço
          </DialogTitle>
          <p className="text-gray-500 text-sm">
            Esta informação é essencial para conectarmos você às oportunidades
            certas da GreenTech na sua região.
          </p>
        </DialogHeader>

        <form className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="rua">Rua / Avenida</Label>
            <Input
              id="rua"
              placeholder="Av. Dr. Maximiliano Baruto"
              value={formData.rua}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="13607-339"
                value={formData.cep}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                placeholder="500"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Jardim Universitário"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="São Paulo"
                value={formData.estado}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Araras"
                value={formData.cidade}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-1/3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
            >
              Próxima etapa →
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
