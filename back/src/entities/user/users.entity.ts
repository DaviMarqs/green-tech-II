import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Unique,
} from "typeorm";

import { Pedido } from "../store/order.entity";
import { Avaliacao } from "../store/review.entity";
import { DadosConsumo } from "./consumptionData.entity";
import { Categoria } from "./category.entity";
import { Produto } from "../store/product.entity";
import { Endereco } from "../address/endereco.entity";

@Entity("gt_usuario")
@Unique("uk_usuario_cpf_cnpj", ["cpf_cnpj"])
@Unique("uk_usuario_email", ["email"])
export class Usuario {
  @PrimaryGeneratedColumn("increment", { name: "id_usuario" })
  id_usuario: number;

  @Column("varchar", { length: 100 })
  nome: string;

  @Column("date", { name: "data_nasc", nullable: true })
  data_nasc: Date | null;

  @Column("varchar", { name: "cpf_cnpj", length: 14 })
  cpf_cnpj: string;

  @Column("varchar", { length: 100 })
  email: string;

  @Column("varchar", { length: 255 })
  senha: string;

  @Column("varchar", { length: 20, nullable: true })
  telefone: string | null;

  // 🔥 NOVO: relação correta com endereço
  @ManyToOne(() => Endereco)
  @JoinColumn({ name: "id_endereco" })
  endereco: Endereco | null;

  // 🔥 Relacionamento correto com produtos
  @OneToMany(() => Produto, (produto) => produto.usuario)
  produtos: Produto[];

  // 🔥 Relacionamento correto com pedidos
  @OneToMany(() => Pedido, (pedido) => pedido.id_usuario_comprador)
  pedidos_comprados: Pedido[];

  @OneToMany(() => Pedido, (pedido) => pedido.id_usuario_vendedor)
  pedidos_vendidos: Pedido[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.usuario)
  avaliacoes: Avaliacao[];

  @OneToMany(() => DadosConsumo, (dados) => dados.id_usuario)
  dados_consumo: DadosConsumo[];

  @ManyToMany(() => Categoria, (categoria) => categoria.usuarios)
  @JoinTable({
    name: "gt_usuario_categoria",
    joinColumn: { name: "id_usuario", referencedColumnName: "id_usuario" },
    inverseJoinColumn: {
      name: "id_categoria",
      referencedColumnName: "id_categoria",
    },
  })
  categorias: Categoria[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updated_at: Date | null;

  @Column("timestamp", { name: "disabled_at", nullable: true })
  disabled_at: Date | null;
}
