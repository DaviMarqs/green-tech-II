import type { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDebitToNupay1763592000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            UPDATE "gt_forma_pagamentos" 
            SET "forma_pagamento" = 'NuPay' 
            WHERE "forma_pagamento" = 'Cartão de Débito'
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            UPDATE "gt_forma_pagamentos" 
            SET "forma_pagamento" = 'Cartão de Débito' 
            WHERE "forma_pagamento" = 'NuPay'
        `);
	}
}
