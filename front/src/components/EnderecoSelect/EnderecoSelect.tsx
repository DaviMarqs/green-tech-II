import { api } from "@/services/api";
import { useEffect, useState } from "react";

interface Estado {
  id_estado: number;
  nome_estado: string;
  sigla: string;
}

interface Cidade {
  id_cidade: number;
  nome_cidade: string;
}

export function EnderecoSelect({
  estadoSelecionado,
  cidadeSelecionada,
  onEstadoChange,
  onCidadeChange,
}: {
  estadoSelecionado: number | null;
  cidadeSelecionada: number | null;
  onEstadoChange: (id: number | null) => void;
  onCidadeChange: (id: number | null) => void;
}) {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  useEffect(() => {
    api.get("/address/estados").then((res) => setEstados(res.data));
  }, []);

  useEffect(() => {
    if (!estadoSelecionado) return;
    api
      .get(`/address/estados/${estadoSelecionado}/cidades`)
      .then((res) => setCidades(res.data));
  }, [estadoSelecionado]);

  return (
    <>
      {/* ESTADO */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Estado</label>
        <select
          className="border rounded-md p-2"
          value={estadoSelecionado ?? ""}
          onChange={(e) => {
            const value = Number(e.target.value) || null;
            onEstadoChange(value);
            onCidadeChange(null);
          }}
        >
          <option value="">Selecione...</option>
          {estados.map((estado) => (
            <option key={estado.id_estado} value={estado.id_estado}>
              {estado.nome_estado} ({estado.sigla})
            </option>
          ))}
        </select>
      </div>

      {/* CIDADE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Cidade</label>
        <select
          className="border rounded-md p-2"
          disabled={!estadoSelecionado}
          value={cidadeSelecionada ?? ""}
          onChange={(e) => {
            const value = Number(e.target.value) || null;
            onCidadeChange(value);
          }}
        >
          <option value="">Selecione...</option>
          {cidades.map((cidade) => (
            <option key={cidade.id_cidade} value={cidade.id_cidade}>
              {cidade.nome_cidade}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
