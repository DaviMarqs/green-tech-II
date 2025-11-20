import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { FormaPagamento } from "../../entities/store/paymentMethod.entity";

async function seed() {
	try {
		await AppDataSource.initialize();
		console.log("📦 Database connected for seeding...");

		const repo = AppDataSource.getRepository(FormaPagamento);

		const methods = [
			{ forma_pagamento: "Pix", parcelamento: 1, ativo: true },
			{ forma_pagamento: "Boleto Bancário", parcelamento: 1, ativo: true },
			{ forma_pagamento: "Nupay", parcelamento: 1, ativo: true },
			{ forma_pagamento: "Cartão de Crédito", parcelamento: 12, ativo: true },
		];

		for (const method of methods) {
			const exists = await repo.findOneBy({
				forma_pagamento: method.forma_pagamento,
			});

			if (!exists) {
				const newMethod = repo.create(method);
				await repo.save(newMethod);
				console.log(`✅ Criado: ${method.forma_pagamento}`);
			} else {
				console.log(`⚠️ Já existe: ${method.forma_pagamento}`);
			}
		}

		console.log("🚀 Seed finalizado com sucesso!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Erro ao rodar seed:", error);
		process.exit(1);
	}
}

seed();
