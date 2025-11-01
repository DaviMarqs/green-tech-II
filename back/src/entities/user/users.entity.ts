// src/entities/Usuario.entity.ts
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
import { Logradouro } from "../address/logradouro.entity.ts";
import { Pedido } from "./Pedido.entity.ts";
import { Avaliacao } from "./Avaliacao.entity.ts";
import { DadosConsumo } from "./DadosConsumo.entity.ts";
import { Categoria } from "./Categoria.entity.ts";

@Entity("gt_usuario")
@Unique("uk_usuario_cpf_cnpj", ["cpfCnpj"]) // Constraints da migration
@Unique("uk_usuario_email", ["email"])
export class Usuario {
	@PrimaryGeneratedColumn("increment", { name: "id_usuario" })
	id_usuario: number;

	@Column("varchar", { length: 100 })
	nome: string;

	@Column("date", { name: "data_nasc", nullable: true })
	data_nasc: Date;

	@Column("varchar", { name: "cpf_cnpj", length: 14 })
	cpfCnpj: string;

	@Column("varchar", { length: 100 })
	email: string;

	@Column("varchar", { length: 255 })
	senha: string;

	@Column("varchar", { length: 20, nullable: true })
	telefone: string;

	@Column("timestamp", { name: "disabled_at", nullable: true })
	disabled_at: Date;

	@Column("varchar", { length: 255, select: false })
	senha: string;

	// Relação: Muitos Usuários moram em um Logradouro (CEP)
	@ManyToOne(
		() => Logradouro,
		(logradouro) => logradouro.usuarios,
	)
	@JoinColumn({ name: "cep" }) // FK é a coluna 'cep'
	logradouro: Logradouro;

	// Relações "filhas" (Este usuário possui...)
	@OneToMany(
		() => Pedido,
		(pedido) => pedido.comprador,
	)
	pedidos_comprados: Pedido[];

	@OneToMany(
		() => Pedido,
		(pedido) => pedido.vendedor,
	)
	pedidos_vendidos: Pedido[];

	@OneToMany(
		() => Avaliacao,
		(avaliacao) => avaliacao.usuario,
	)
	avaliacoes: Avaliacao[];

	@OneToMany(
		() => DadosConsumo,
		(dados) => dados.usuario,
	)
	dados_consumo: DadosConsumo[];

	// Relação: Muitos Usuários para Muitas Categorias
	@ManyToMany(
		() => Categoria,
		(categoria) => categoria.usuarios,
	)
	@JoinTable({
		name: "gt_usuario_categoria", // Tabela de junção
		joinColumn: { name: "id_usuario", referencedColumnName: "id" },
		inverseJoinColumn: { name: "id_categoria", referencedColumnName: "id" },
	})
	categorias: Categoria[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
