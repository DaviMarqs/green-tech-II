import {
	type MigrationInterface,
	type QueryRunner,
	Table,
	TableForeignKey,
} from "typeorm";

export class CriarTabelaAvaliacao1763656301062 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const tableExists = await queryRunner.hasTable("gt_avaliacao");
		if (tableExists) {
			await queryRunner.dropTable("gt_avaliacao");
		}

		await queryRunner.createTable(
			new Table({
				name: "gt_avaliacao",
				columns: [
					{
						name: "id_avaliacao",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "nota",
						type: "int",
						isNullable: false,
					},
					{
						name: "descricao",
						type: "varchar",
						length: "200",
						isNullable: true,
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()",
					},
					{
						name: "updated_at",
						type: "timestamp",
						isNullable: true,
						default: "now()",
					},
					{
						name: "id_usuario",
						type: "int",
					},
					{
						name: "id_produto",
						type: "int",
					},
				],
			}),
		);

		await queryRunner.query(
			`ALTER TABLE "gt_avaliacao" ADD CONSTRAINT "chk_avaliacao_nota" CHECK ("nota" >= 0 AND "nota" <= 5)`,
		);

		await queryRunner.createForeignKey(
			"gt_avaliacao",
			new TableForeignKey({
				name: "FK_avaliacao_usuario",
				columnNames: ["id_usuario"],
				referencedColumnNames: ["id_usuario"],
				referencedTableName: "gt_usuario",
				onDelete: "CASCADE", // Se deletar o usuario, deleta a avaliação
			}),
		);

		await queryRunner.createForeignKey(
			"gt_avaliacao",
			new TableForeignKey({
				name: "FK_avaliacao_produto",
				columnNames: ["id_produto"],
				referencedColumnNames: ["id_produto"],
				referencedTableName: "gt_produto",
				onDelete: "CASCADE", // Se deletar o produto, deleta a avaliação
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("gt_avaliacao");
	}
}
