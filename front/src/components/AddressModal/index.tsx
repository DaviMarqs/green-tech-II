import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EnderecoSelect } from "../EnderecoSelect/EnderecoSelect";

export default function AddressModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [addressId, setAddressId] = useState<number | null>(null);

  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [cidadeId, setCidadeId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    logradouro: "",
    numero: "",
    bairro: "",
    cep: "",
    estado: "",
    cidade: "",
  });

  const [loading, setLoading] = useState(false);

  /* -------------------- LOAD USER ADDRESS IF EXISTS -------------------- */
  useEffect(() => {
    if (!open || !user) return;

    async function loadUserAddress() {
      try {
        const { data } = await api.get(`/address/user/${user?.id_usuario}`);

        if (data && data.length > 0) {
          console.log("data", data);
          const addr = data[0]; // pega o primeiro endereço

          setAddressId(addr.id_endereco);

          setCidadeId(addr.cidade?.id_cidade || null);
          setEstadoId(addr.estado?.id_estado || null);

          setFormData({
            logradouro: addr.logradouro || "",
            numero: addr.numero?.toString() || "",
            bairro: addr.bairro || "",
            cep: addr.cep || "",
            estado: addr.estado?.nome_estado || "",
            cidade: addr.cidade?.nome_cidade || "",
          });
        }
      } catch (error) {
        console.log("Usuário sem endereço ainda.");
      }
    }

    loadUserAddress();
  }, [open, user]);

  /* -------------------------- FORM CHANGE -------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* -------------------------- CREATE OR UPDATE -------------------------- */
  const handleSubmit = async () => {
    if (
      !formData.logradouro ||
      !formData.numero ||
      !formData.bairro ||
      !formData.cep ||
      !estadoId ||
      !cidadeId
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      if (user == null) {
        toast.error("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const payload = {
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cep: formData.cep,
        id_estado: estadoId,
        id_cidade: cidadeId,
        user_id: user.id_usuario,
      };

      let response;

      if (addressId) {
        response = await api.put(`/address/${addressId}`, payload);
        toast.success("Endereço atualizado!");
      } else {
        response = await api.post("/address", payload);
        toast.success("Endereço cadastrado!");
      }

      localStorage.setItem(
        "userAddress",
        JSON.stringify({
          ...payload,
          cidade: formData.cidade,
          estado: formData.estado,
        })
      );
      onClose();
      navigate("/checkout");
    } catch (error) {
      toast.error("Erro ao salvar endereço.");
    } finally {
      setLoading(false);
    }
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
            <Label htmlFor="logradouro">Rua / Avenida</Label>
            <Input
              id="logradouro"
              placeholder="Av. Dr. Maximiliano Baruto"
              value={formData.logradouro}
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
            <EnderecoSelect
              estadoSelecionado={estadoId}
              cidadeSelecionada={cidadeId}
              onEstadoChange={setEstadoId}
              onCidadeChange={setCidadeId}
            />
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
              disabled={loading}
              onClick={handleSubmit}
              className={`w-1/2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {loading
                ? "Salvando..."
                : addressId
                ? "Atualizar →"
                : "Próxima etapa →"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
