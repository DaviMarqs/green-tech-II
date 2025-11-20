import {
	type MigrationInterface,
	type QueryRunner,
	TableColumn,
} from "typeorm";

export class AddNumeroToUsuario1763656305000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"gt_usuario",
			new TableColumn({
				name: "numero",
				type: "varchar",
				length: "20",
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("gt_usuario", "numero");
	}
}
