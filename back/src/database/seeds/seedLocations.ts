import axios from "axios";
import { AppDataSource } from "../data-source";

export async function run() {
  const estadoRepo = AppDataSource.getRepository("gt_estado");
  const cidadeRepo = AppDataSource.getRepository("gt_cidade");

  const estadoCount = await estadoRepo.count();
  const cidadeCount = await cidadeRepo.count();

  // --------------------------
  // SEED DE ESTADOS
  // --------------------------
  if (estadoCount === 0) {
    console.log("🌍 Baixando estados do IBGE...");

    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );

    const estados = response.data;

    for (const estado of estados) {
      console.log("Estado:", estado);
      await estadoRepo.insert({
        nome_estado: estado.nome,
        id_estado_ibge: estado.id,
        sigla: estado.sigla,
      });

      console.log(`   ✔ Estado inserido: ${estado.nome}`);
    }

    console.log("🎉 Todos os estados foram inseridos!\n");
  } else {
    console.log("⚠️ Estados já existem no banco, ignorando seed.\n");
  }

  // --------------------------
  // SEED DE CIDADES
  // --------------------------
  if (cidadeCount === 0) {
    console.log("🏙 Baixando cidades do IBGE...\n");

    const estados = await estadoRepo.find();

    for (const estado of estados) {
      console.log(`📥 Baixando cidades de ${estado.nome_estado}...`);

      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id_estado_ibge}/municipios`
      );

      const cidades = response.data;

      for (const cidade of cidades) {
        console.log({
          nome_cidade: cidade.nome,
          id_estado: estado.id_estado,
        });
        await cidadeRepo.insert({
          nome_cidade: cidade.nome,
          id_estado: estado.id_estado,
        });
      }

      console.log(
        `   🏗 Inseridas ${cidades.length} cidades de ${estado.nome_estado}\n`
      );
    }

    console.log("🎉 Todas as cidades foram inseridas!\n");
  } else {
    console.log("⚠️ Cidades já existem no banco, ignorando seed.\n");
  }
}
