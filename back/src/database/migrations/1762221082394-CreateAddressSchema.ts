import {
	type MigrationInterface,
	type QueryRunner,
	Table,
	TableForeignKey,
} from "typeorm";

export class CreateAddressSchema1762221082394 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "gt_estado",
				columns: [
					{
						name: "id_estado",
						type: "integer",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "nome_estado",
						type: "varchar",
						length: "100",
					},
					{
						name: "sigla",
						type: "varchar",
						length: "2",
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
					},
				],
			}),
			true,
		);

		await queryRunner.createTable(
			new Table({
				name: "gt_cidade",
				columns: [
					{
						name: "id_cidade",
						type: "integer",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "nome_cidade",
						type: "varchar",
						length: "100",
					},
					{
						name: "id_estado",
						type: "integer",
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
					},
				],
				foreignKeys: [
					new TableForeignKey({
						name: "FK_Cidade_Estado",
						columnNames: ["id_estado"],
						referencedColumnNames: ["id_estado"],
						referencedTableName: "gt_estado",
						onDelete: "NO ACTION",
						onUpdate: "NO ACTION",
					}),
				],
			}),
			true,
		);

		await queryRunner.createTable(
			new Table({
				name: "gt_bairro",
				columns: [
					{
						name: "id_bairro",
						type: "integer",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "nome_bairro",
						type: "varchar",
						length: "100",
					},
					{
						name: "id_cidade",
						type: "integer",
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
					},
				],
				foreignKeys: [
					new TableForeignKey({
						name: "FK_Bairro_Cidade",
						columnNames: ["id_cidade"],
						referencedColumnNames: ["id_cidade"],
						referencedTableName: "gt_cidade",
						onDelete: "NO ACTION",
						onUpdate: "NO ACTION",
					}),
				],
			}),
			true,
		);

		await queryRunner.createTable(
			new Table({
				name: "gt_logradouro",
				columns: [
					{
						name: "cep",
						type: "varchar",
						length: "8",
						isPrimary: true,
					},
					{
						name: "logradouro",
						type: "varchar",
						length: "100",
					},
					{
						name: "id_bairro",
						type: "integer",
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
					},
				],
				foreignKeys: [
					new TableForeignKey({
						name: "FK_Logradouro_Bairro",
						columnNames: ["id_bairro"],
						referencedColumnNames: ["id_bairro"],
						referencedTableName: "gt_bairro",
						onDelete: "NO ACTION",
						onUpdate: "NO ACTION",
					}),
				],
			}),
			true,
		);

		await queryRunner.createTable(
			new Table({
				name: "gt_endereco",
				columns: [
					{
						name: "id_endereco",
						type: "integer",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "numero",
						type: "varchar",
						length: "10",
					},
					{
						name: "complemento",
						type: "varchar",
						length: "100",
						isNullable: true,
					},
					{
						name: "cep",
						type: "varchar",
						length: "8",
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
					},
				],
				foreignKeys: [
					new TableForeignKey({
						name: "FK_Endereco_Logradouro",
						columnNames: ["cep"],
						referencedColumnNames: ["cep"],
						referencedTableName: "gt_logradouro",
						onDelete: "NO ACTION",
						onUpdate: "NO ACTION",
					}),
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("gt_endereco");
		await queryRunner.dropTable("gt_logradouro");
		await queryRunner.dropTable("gt_bairro");
		await queryRunner.dropTable("gt_cidade");
		await queryRunner.dropTable("gt_estado");
	}
}
