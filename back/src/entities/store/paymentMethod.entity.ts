import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("gt_forma_pagamentos")
export class FormaPagamento {
	@PrimaryGeneratedColumn("increment", { name: "id_pagamento" })
	id_pagamento: number;

	@Column("varchar", { length: 30, name: "forma_pagamento" })
	forma_pagamento: string;

	@Column("integer", { name: "parcelamento" })
	parcelamento: number;

	@Column("boolean", { name: "ativo", default: true })
	ativo: boolean;
}
