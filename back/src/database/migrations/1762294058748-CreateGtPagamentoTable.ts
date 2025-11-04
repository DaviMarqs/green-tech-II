import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGtPagamentoTable1762294058748 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "gt_pagamento" (
                "id_pagamento" SERIAL NOT NULL,
                "valor" numeric(10,2) NOT NULL,
                "status" character varying(255) NOT NULL DEFAULT 'PENDENTE',
                "metodo_pagamento" character varying(50) NOT NULL,
                "parcelas" integer,
                "id_transacao_externa" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id_pedido" integer,
                "id_usuario" integer,
                CONSTRAINT "PK_gt_pagamento" PRIMARY KEY ("id_pagamento"),
                CONSTRAINT "CHECK_pagamento_status" CHECK ("status" IN ('PENDENTE', 'CONCLUIDO', 'FALHA'))
            )`,
		);

		await queryRunner.query(
			`ALTER TABLE "gt_pagamento"
             ADD CONSTRAINT "FK_pagamento_pedido"
             FOREIGN KEY ("id_pedido")
             REFERENCES "gt_pedido"("id_pedido")
             ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);

		await queryRunner.query(
			`ALTER TABLE "gt_pagamento"
             ADD CONSTRAINT "FK_pagamento_usuario"
             FOREIGN KEY ("id_usuario")
             REFERENCES "gt_usuario"("id_usuario")
             ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "gt_pagamento" DROP CONSTRAINT "FK_pagamento_usuario"`,
		);
		await queryRunner.query(
			`ALTER TABLE "gt_pagamento" DROP CONSTRAINT "FK_pagamento_pedido"`,
		);

		await queryRunner.query(`DROP TABLE "gt_pagamento"`);
	}
}
