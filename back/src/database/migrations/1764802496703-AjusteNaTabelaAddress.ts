import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AjusteNaTabelaAddress1764802496703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "gt_estado",
      new TableColumn({
        name: "id_estado_ibge",
        type: "int",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("gt_estado", "id_estado_ibge");
  }
}
