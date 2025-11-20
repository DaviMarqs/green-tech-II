// seed de métodos de pagamento
import { AppDataSource } from "../data-source";
import { FormaPagamento } from "../../entities/store/paymentMethod.entity";

export async function run() {
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
      await repo.save(repo.create(method));
      console.log(`   ✔ Criado: ${method.forma_pagamento}`);
    } else {
      console.log(`   ↪ Já existe: ${method.forma_pagamento}`);
    }
  }
}
