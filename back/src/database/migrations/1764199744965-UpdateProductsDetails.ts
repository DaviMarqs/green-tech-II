import { MigrationInterface, QueryRunner } from "typeorm";

export class  UpdateProductsDetails1764199744965 implements MigrationInterface {

      public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Cota Residencial Básica (150 kWh/mês)', 
                    descricao = 'Ideal para apartamentos ou casais sem filhos. Abate médio de R$ 150 na conta.',
                    preco = 5250.00
                WHERE nome_produto = 'Painel Solar 550W';
            `);

            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Cota Residencial Família (400 kWh/mês)', 
                    descricao = 'Perfeito para casas com 4 pessoas e ar-condicionado. Abate médio de R$ 400 na conta.',
                    preco = 14000.00
                WHERE nome_produto = 'Inversor Solar 5kW';
            `);

            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Cota Pequeno Comércio (1000 kWh/mês)', 
                    descricao = 'Para padarias, escritórios ou lojas de rua. Alta capacidade de geração.',
                    preco = 32000.00
                WHERE nome_produto = 'Kit Solar Residencial';
            `);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Painel Solar 550W', 
                    descricao = 'Painel solar monocristalino de alta eficiência',
                    preco = 1250.00
                WHERE nome_produto = 'Cota Residencial Básica (150 kWh/mês)';
            `);

            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Inversor Solar 5kW', 
                    descricao = 'Inversor de energia solar trifásico',
                    preco = 4800.00
                WHERE nome_produto = 'Cota Residencial Família (400 kWh/mês)';
            `);

            await queryRunner.query(`
                UPDATE gt_produto 
                SET nome_produto = 'Kit Solar Residencial', 
                    descricao = 'Kit completo para geração de energia solar em residências',
                    preco = 9700.00
                WHERE nome_produto = 'Cota Pequeno Comércio (1000 kWh/mês)';
            `);
        }

}
