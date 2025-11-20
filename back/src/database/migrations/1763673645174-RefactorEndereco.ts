import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";

export class RefactorEndereco1763673645174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Remover tabela antiga caso exista parcialmente ---
    const hasEndereco = await queryRunner.hasTable("gt_endereco");
    if (hasEndereco) {
      await queryRunner.dropTable("gt_endereco", true);
    }

    // --- Remover FKs antigas ---
    const logradouroTable = await queryRunner.getTable("gt_logradouro");
    const bairroTable = await queryRunner.getTable("gt_bairro");
    const usuarioTable = await queryRunner.getTable("gt_usuario");

    if (logradouroTable) {
      const fk = logradouroTable.foreignKeys.find(
        (fk) => fk.name === "fk_logradouro_bairro"
      );
      if (fk) await queryRunner.dropForeignKey("gt_logradouro", fk);
    }

    if (bairroTable) {
      const fk = bairroTable.foreignKeys.find(
        (fk) => fk.name === "fk_bairro_cidade"
      );
      if (fk) await queryRunner.dropForeignKey("gt_bairro", fk);
    }

    if (usuarioTable) {
      const fk = usuarioTable.foreignKeys.find(
        (fk) => fk.name === "fk_usuario_logradouro"
      );
      if (fk) await queryRunner.dropForeignKey("gt_usuario", fk);
    }

    // --- Criar nova tabela de endereços ---
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
          { name: "logradouro", type: "varchar", length: "120" },
          { name: "numero", type: "integer", isNullable: true },
          { name: "bairro", type: "varchar", length: "100" },
          { name: "id_estado", type: "integer" },
          { name: "id_cidade", type: "integer" },
          { name: "user_id", type: "integer" },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          { name: "updated_at", type: "timestamp", isNullable: true },
        ],
      })
    );

    // --- FKs da nova tabela ---
    await queryRunner.createForeignKey(
      "gt_endereco",
      new TableForeignKey({
        name: "fk_endereco_estado",
        columnNames: ["id_estado"],
        referencedTableName: "gt_estado",
        referencedColumnNames: ["id_estado"],
      })
    );

    await queryRunner.createForeignKey(
      "gt_endereco",
      new TableForeignKey({
        name: "fk_endereco_cidade",
        columnNames: ["id_cidade"],
        referencedTableName: "gt_cidade",
        referencedColumnNames: ["id_cidade"],
      })
    );

    await queryRunner.createForeignKey(
      "gt_endereco",
      new TableForeignKey({
        name: "fk_endereco_usuario",
        columnNames: ["user_id"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );

    // --- Remover CEP do usuário ---
    const hasCepColumn = usuarioTable?.columns.some((c) => c.name === "cep");
    if (hasCepColumn) {
      await queryRunner.dropColumn("gt_usuario", "cep");
    }

    // --- Remover número do usuário ---
    const hasNumeroColumn = usuarioTable?.columns.some(
      (c) => c.name === "numero"
    );
    if (hasNumeroColumn) {
      await queryRunner.dropColumn("gt_usuario", "numero");
    }

    // --- Adicionar id_endereco ao usuário ---
    const hasIdEndereco = usuarioTable?.columns.some(
      (c) => c.name === "id_endereco"
    );
    if (!hasIdEndereco) {
      await queryRunner.addColumn(
        "gt_usuario",
        new TableColumn({
          name: "id_endereco",
          type: "integer",
          isNullable: true,
        })
      );

      await queryRunner.createForeignKey(
        "gt_usuario",
        new TableForeignKey({
          name: "fk_usuario_endereco",
          columnNames: ["id_endereco"],
          referencedTableName: "gt_endereco",
          referencedColumnNames: ["id_endereco"],
        })
      );
    }

    // --- Remover tabelas antigas ---
    await queryRunner.dropTable("gt_logradouro", true);
    await queryRunner.dropTable("gt_bairro", true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter alterações do usuário
    await queryRunner.dropForeignKey("gt_usuario", "fk_usuario_endereco");
    await queryRunner.dropColumn("gt_usuario", "id_endereco");

    // Recriar colunas antigas
    await queryRunner.addColumn(
      "gt_usuario",
      new TableColumn({
        name: "cep",
        type: "varchar",
        length: "14",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "gt_usuario",
      new TableColumn({
        name: "numero",
        type: "integer",
        isNullable: true,
      })
    );

    // Recriar tabelas antigas
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
          { name: "nome_bairro", type: "varchar", length: "100" },
          { name: "id_cidade", type: "integer" },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "gt_logradouro",
        columns: [
          { name: "cep", type: "varchar", length: "14", isPrimary: true },
          { name: "logradouro", type: "varchar", length: "100" },
          { name: "id_bairro", type: "integer" },
        ],
      })
    );

    await queryRunner.dropTable("gt_endereco");
  }
}
