import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class Main1761779458481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1-) Criação da tabela de Estados
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
          { name: "nome_estado", type: "varchar", length: "100" },
          { name: "sigla", type: "varchar", length: "2" },
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

    // 2-) Criação da tabela de Cidades
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
          { name: "nome_cidade", type: "varchar", length: "100" },
          { name: "id_estado", type: "integer" },
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

    // 3-) Criação da tabela de Bairros
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

    // 4-) Criação da tabela de Logradouros
    await queryRunner.createTable(
      new Table({
        name: "gt_logradouro",
        columns: [
          { name: "cep", type: "varchar", length: "14", isPrimary: true }, // mudei de 8 para 14
          { name: "logradouro", type: "varchar", length: "100" },
          { name: "id_bairro", type: "integer" },
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

    // 5-) Criação da tabela de Usuários
    await queryRunner.createTable(
      new Table({
        name: "gt_usuario",
        columns: [
          {
            name: "id_usuario",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "nome", type: "varchar", length: "100" },
          { name: "data_nasc", type: "date", isNullable: true },
          { name: "cpf_cnpj", type: "varchar", length: "14" },
          { name: "email", type: "varchar", length: "100" },
          { name: "senha", type: "varchar", length: "255" },
          { name: "telefone", type: "varchar", length: "20", isNullable: true },
          { name: "cep", type: "varchar", length: "14" }, // mudei de 8 para 14
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          { name: "updated_at", type: "timestamp", isNullable: true },
        ],
        uniques: [
          new TableUnique({
            name: "uk_usuario_cpf_cnpj",
            columnNames: ["cpf_cnpj"],
          }),
          new TableUnique({ name: "uk_usuario_email", columnNames: ["email"] }),
        ],
      })
    );

    // 6-) Criação da tabela de Produtos
    await queryRunner.createTable(
      new Table({
        name: "gt_produto",
        columns: [
          {
            name: "id_produto",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "nome_produto", type: "varchar", length: "100" },
          {
            name: "descricao",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          { name: "preco", type: "decimal", precision: 10, scale: 2 },
          { name: "quantidade_estoque", type: "integer" },
          { name: "id_usuario", type: "integer" },
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

    // 7-) Criação da tabela de Pedidos
    await queryRunner.createTable(
      new Table({
        name: "gt_pedido",
        columns: [
          {
            name: "id_pedido",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "valor", type: "decimal", precision: 10, scale: 2 },
          { name: "data_pedido", type: "date" },
          { name: "forma_pagamento", type: "varchar", length: "50" },
          { name: "status", type: "varchar", length: "50" },
          { name: "parcelas", type: "integer", isNullable: true },
          { name: "id_usuario_comprador", type: "integer" },
          { name: "id_usuario_vendedor", type: "integer" },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          { name: "updated_at", type: "timestamp", isNullable: true },
        ],
        checks: [
          new TableCheck({
            name: "chk_pedido_status",
            expression:
              "status IN ('AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_TRANSPORTE', 'ENTREGUE', 'CANCELADO')",
          }),
        ],
      })
    );

    // 8-) Criação da tabela associativa de Pedido e Produto
    await queryRunner.createTable(
      new Table({
        name: "gt_pedido_produto",
        columns: [
          { name: "id_pedido", type: "integer", isPrimary: true },
          { name: "id_produto", type: "integer", isPrimary: true },
          { name: "quantidade", type: "integer" },
        ],
      })
    );

    // 9-) Criação da tabela de Notas Fiscais (PK corrigida para nf_numero)
    await queryRunner.createTable(
      new Table({
        name: "gt_notafiscal",
        columns: [
          {
            name: "nf_numero",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nome_destinatario",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "email_destinatario",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "endereco_destinatario",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "cpf_cnpj_destinatario",
            type: "varchar",
            length: "14",
            isNullable: true,
          },
          {
            name: "nome_razao_emitente",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "cnpj_emitente",
            type: "varchar",
            length: "14",
            isNullable: true,
          },
          {
            name: "email_emitente",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          { name: "id_pedido", type: "integer" },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      })
    );

    // 10-) Criação da tabela associativa de Produto e Nota Fiscal (FK corrigida para numero_nf)
    await queryRunner.createTable(
      new Table({
        name: "gt_produto_notafiscal",
        columns: [
          { name: "id_produto", type: "integer", isPrimary: true },
          { name: "numero_nf", type: "integer", isPrimary: true },
          { name: "quantidade", type: "integer" },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      })
    );

    // 11-) Criação da tabela de Avaliações
    await queryRunner.createTable(
      new Table({
        name: "gt_avaliacao",
        columns: [
          {
            name: "id_avaliacao",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "nota", type: "integer", isNullable: true },
          {
            name: "descricao",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          { name: "id_usuario", type: "integer" },
          { name: "id_produto", type: "integer" },
          { name: "id_pedido", type: "integer" },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          { name: "updated_at", type: "timestamp", isNullable: true },
        ],
        checks: [
          new TableCheck({
            name: "chk_avaliacao_nota",
            expression: "nota >= 1 AND nota <= 5",
          }),
        ],
      })
    );

    // 12-) Criação da tabela de Dados de Consumo
    await queryRunner.createTable(
      new Table({
        name: "gt_dados_consumo",
        columns: [
          {
            name: "id_dados_consumo",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "consumo_energia", type: "integer", isNullable: true },
          {
            name: "taxa_distribuidora",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "descricao",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          { name: "id_usuario", type: "integer" },
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

    // 13-) Criação da tabela de Categorias de Usuário (Renomeada para gt_categorias)
    await queryRunner.createTable(
      new Table({
        name: "gt_categorias",
        columns: [
          {
            name: "id_categoria",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "descricao", type: "varchar", length: "100" },
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

    // 14-) Criação da tabela associativa de Usuário e Categoria (Renomeada para gt_usuario_categoria)
    await queryRunner.createTable(
      new Table({
        name: "gt_usuario_categoria",
        columns: [
          { name: "id_usuario", type: "integer", isPrimary: true },
          { name: "id_categoria", type: "integer", isPrimary: true },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "gt_cidade",
      new TableForeignKey({
        name: "fk_cidade_estado",
        columnNames: ["id_estado"],
        referencedTableName: "gt_estado",
        referencedColumnNames: ["id_estado"],
      })
    );

    await queryRunner.createForeignKey(
      "gt_bairro",
      new TableForeignKey({
        name: "fk_bairro_cidade",
        columnNames: ["id_cidade"],
        referencedTableName: "gt_cidade",
        referencedColumnNames: ["id_cidade"],
      })
    );

    await queryRunner.createForeignKey(
      "gt_logradouro",
      new TableForeignKey({
        name: "fk_logradouro_bairro",
        columnNames: ["id_bairro"],
        referencedTableName: "gt_bairro",
        referencedColumnNames: ["id_bairro"],
      })
    );

    // Precisa voltar quando tiver a tabela de logradouro populada
    // await queryRunner.createForeignKey(
    //   "gt_usuario",
    //   new TableForeignKey({
    //     name: "fk_usuario_logradouro",
    //     columnNames: ["cep"],
    //     referencedTableName: "gt_logradouro",
    //     referencedColumnNames: ["cep"],
    //   })
    // );

    await queryRunner.createForeignKey(
      "gt_pedido",
      new TableForeignKey({
        name: "fk_pedido_comprador",
        columnNames: ["id_usuario_comprador"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_pedido",
      new TableForeignKey({
        name: "fk_pedido_vendedor",
        columnNames: ["id_usuario_vendedor"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_pedido_produto",
      new TableForeignKey({
        name: "fk_pedprod_pedido",
        columnNames: ["id_pedido"],
        referencedTableName: "gt_pedido",
        referencedColumnNames: ["id_pedido"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_pedido_produto",
      new TableForeignKey({
        name: "fk_pedprod_produto",
        columnNames: ["id_produto"],
        referencedTableName: "gt_produto",
        referencedColumnNames: ["id_produto"],
      })
    );

    // 9) FK gt_notafiscal -> gt_pedido
    await queryRunner.createForeignKey(
      "gt_notafiscal",
      new TableForeignKey({
        name: "fk_notafiscal_pedido",
        columnNames: ["id_pedido"],
        referencedTableName: "gt_pedido",
        referencedColumnNames: ["id_pedido"],
      })
    );

    // 10) FKs gt_produto_notafiscal -> gt_produto E gt_notafiscal
    await queryRunner.createForeignKey(
      "gt_produto_notafiscal",
      new TableForeignKey({
        name: "fk_prodnf_produto",
        columnNames: ["id_produto"],
        referencedTableName: "gt_produto",
        referencedColumnNames: ["id_produto"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_produto_notafiscal",
      new TableForeignKey({
        name: "fk_prodnf_notafiscal",
        columnNames: ["numero_nf"], // Corrigido
        referencedTableName: "gt_notafiscal",
        referencedColumnNames: ["nf_numero"], // Corrigido
      })
    );

    await queryRunner.createForeignKey(
      "gt_produto",
      new TableForeignKey({
        name: "fk_produto_usuario",
        columnNames: ["id_usuario"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );

    // 11) FKs gt_avaliacao -> gt_usuario, gt_produto, gt_pedido
    await queryRunner.createForeignKey(
      "gt_avaliacao",
      new TableForeignKey({
        name: "fk_avaliacao_usuario",
        columnNames: ["id_usuario"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_avaliacao",
      new TableForeignKey({
        name: "fk_avaliacao_produto",
        columnNames: ["id_produto"],
        referencedTableName: "gt_produto",
        referencedColumnNames: ["id_produto"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_avaliacao",
      new TableForeignKey({
        name: "fk_avaliacao_pedido",
        columnNames: ["id_pedido"],
        referencedTableName: "gt_pedido",
        referencedColumnNames: ["id_pedido"],
      })
    );

    // 12) FK gt_dados_consumo -> gt_usuario
    await queryRunner.createForeignKey(
      "gt_dados_consumo",
      new TableForeignKey({
        name: "fk_dados_consumo_usuario",
        columnNames: ["id_usuario"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );

    // 14) FKs gt_usuario_categoria -> gt_usuario E gt_categorias
    await queryRunner.createForeignKey(
      "gt_usuario_categoria",
      new TableForeignKey({
        name: "fk_usuariocat_usuario",
        columnNames: ["id_usuario"],
        referencedTableName: "gt_usuario",
        referencedColumnNames: ["id_usuario"],
      })
    );
    await queryRunner.createForeignKey(
      "gt_usuario_categoria",
      new TableForeignKey({
        name: "fk_usuariocat_categoria",
        columnNames: ["id_categoria"],
        referencedTableName: "gt_categorias", // Corrigido
        referencedColumnNames: ["id_categoria"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "gt_usuario_categoria",
      "fk_usuariocat_categoria"
    );
    await queryRunner.dropForeignKey(
      "gt_usuario_categoria",
      "fk_usuariocat_usuario"
    );
    await queryRunner.dropForeignKey(
      "gt_dados_consumo",
      "fk_dados_consumo_usuario"
    );
    await queryRunner.dropForeignKey("gt_avaliacao", "fk_avaliacao_pedido");
    await queryRunner.dropForeignKey("gt_avaliacao", "fk_avaliacao_produto");
    await queryRunner.dropForeignKey("gt_avaliacao", "fk_avaliacao_usuario");
    await queryRunner.dropForeignKey(
      "gt_produto_notafiscal",
      "fk_prodnf_notafiscal"
    );
    await queryRunner.dropForeignKey(
      "gt_produto_notafiscal",
      "fk_prodnf_produto"
    );
    await queryRunner.dropForeignKey("gt_notafiscal", "fk_notafiscal_pedido");
    await queryRunner.dropForeignKey("gt_pedido_produto", "fk_pedprod_produto");
    await queryRunner.dropForeignKey("gt_pedido_produto", "fk_pedprod_pedido");
    await queryRunner.dropForeignKey("gt_pedido", "fk_pedido_vendedor");
    await queryRunner.dropForeignKey("gt_pedido", "fk_pedido_comprador");
    // await queryRunner.dropForeignKey("gt_usuario", "fk_usuario_logradouro");
    await queryRunner.dropForeignKey("gt_logradouro", "fk_logradouro_bairro");
    await queryRunner.dropForeignKey("gt_bairro", "fk_bairro_cidade");
    await queryRunner.dropForeignKey("gt_cidade", "fk_cidade_estado");
    await queryRunner.dropForeignKey("gt_produto", "fk_produto_usuario");

    await queryRunner.dropTable("gt_usuario_categoria");
    await queryRunner.dropTable("gt_categorias");
    await queryRunner.dropTable("gt_dados_consumo");
    await queryRunner.dropTable("gt_avaliacao");
    await queryRunner.dropTable("gt_produto_notafiscal");
    await queryRunner.dropTable("gt_notafiscal");
    await queryRunner.dropTable("gt_pedido_produto");
    await queryRunner.dropTable("gt_pedido");
    await queryRunner.dropTable("gt_produto");
    await queryRunner.dropTable("gt_usuario");
    await queryRunner.dropTable("gt_logradouro");
    await queryRunner.dropTable("gt_bairro");
    await queryRunner.dropTable("gt_cidade");
    await queryRunner.dropTable("gt_estado");
  }
}
