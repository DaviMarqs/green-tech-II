import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndProductsMock1762209338093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Inserir usuários de exemplo
    await queryRunner.query(`
      INSERT INTO gt_usuario (nome, data_nasc, cpf_cnpj, email, senha, telefone, cep, created_at)
      VALUES
        ('João Silva', '1990-05-15', '12345678901', 'joao@email.com', '123456', '11999999999', '12345-678', NOW()),
        ('Maria Souza', '1988-09-22', '98765432100', 'maria@email.com', 'abcdef', '21988888888', '98765-432', NOW());
    `);

    // 2️⃣ Inserir produtos de exemplo
    // Observe: aqui estamos ligando produtos aos usuários inseridos acima (ids 1 e 2)
    await queryRunner.query(`
      INSERT INTO gt_produto (nome_produto, descricao, preco, quantidade_estoque, id_usuario, created_at)
      VALUES
        ('Painel Solar 550W', 'Painel solar monocristalino de alta eficiência', 1250.00, 10, 1, NOW()),
        ('Inversor Solar 5kW', 'Inversor de energia solar trifásico', 4800.00, 5, 1, NOW()),
        ('Kit Solar Residencial', 'Kit completo para geração de energia solar em residências', 9700.00, 3, 2, NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // rollback: remove os dados inseridos
    await queryRunner.query(`
      DELETE FROM gt_produto WHERE nome_produto IN (
        'Painel Solar 550W', 'Inversor Solar 5kW', 'Kit Solar Residencial'
      );
    `);

    await queryRunner.query(`
      DELETE FROM gt_usuario WHERE email IN ('joao@email.com', 'maria@email.com');
    `);
  }
}
