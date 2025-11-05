import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddDisabledAtToUser1762291965142 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "gt_usuario" ADD "disabled_at" TIMESTAMP`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "gt_usuario" DROP COLUMN "disabled_at"`,
		);
	}
}
