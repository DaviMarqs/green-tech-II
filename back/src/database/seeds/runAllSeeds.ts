import "reflect-metadata";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../data-source";

async function runAllSeeds() {
  try {
    await AppDataSource.initialize();
    console.log("📦 Database connected for seeding...\n");

    const seedsDir = path.join(__dirname);
    const files = fs
      .readdirSync(seedsDir)
      .filter(
        (file) =>
          file !== "runAllSeeds.ts" &&
          file !== "runAllSeeds.js" &&
          (file.endsWith(".ts") || file.endsWith(".js"))
      )
      .sort(); // roda em ordem alfabética

    if (files.length === 0) {
      console.log("⚠️ Nenhum seed encontrado na pasta.");
      process.exit(0);
    }

    console.log(`🔎 Encontrados ${files.length} seeds:\n`);
    files.forEach((f) => console.log(" - " + f));
    console.log("\n🚀 Iniciando execução dos seeds...\n");

    for (const file of files) {
      const seedPath = path.join(seedsDir, file);
      console.log(`👉 Rodando seed: ${file}`);

      const seedModule = await import(seedPath);

      if (!seedModule.run) {
        console.log(
          `⚠️ O seed "${file}" não exporta a função "run". Pulando.\n`
        );
        continue;
      }

      await seedModule.run();
      console.log(`✅ Seed concluído: ${file}\n`);
    }

    console.log("🎉 Todos os seeds foram executados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao rodar seeds:", error);
    process.exit(1);
  }
}

runAllSeeds();
