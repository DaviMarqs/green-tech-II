import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFormaPagamentos1763591992407 implements MigrationInterface {
	name = "CreateFormaPagamentos1763591992407";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "gt_forma_pagamentos" (
                "id_pagamento" SERIAL NOT NULL, 
                "forma_pagamento" character varying(30) NOT NULL, 
                "parcelamento" integer NOT NULL, 
                "ativo" boolean NOT NULL DEFAULT true, 
                CONSTRAINT "PK_gt_forma_pagamentos_id" PRIMARY KEY ("id_pagamento")
            )
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "gt_forma_pagamentos"`);
	}
}
