import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCepToEndereco1763918723479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get table metadata
    const enderecoTable = await queryRunner.getTable("gt_endereco");

    // Safety check: only add if it doesn't exist yet
    const hasCepColumn = enderecoTable?.columns.some(
      (column) => column.name === "cep"
    );

    if (!hasCepColumn) {
      await queryRunner.addColumn(
        "gt_endereco",
        new TableColumn({
          name: "cep",
          type: "varchar",
          length: "14", // same length you used on gt_usuario
          isNullable: true, // or false, if you want to force CEP for all addresses
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const enderecoTable = await queryRunner.getTable("gt_endereco");

    const hasCepColumn = enderecoTable?.columns.some(
      (column) => column.name === "cep"
    );

    if (hasCepColumn) {
      await queryRunner.dropColumn("gt_endereco", "cep");
    }
  }
}
