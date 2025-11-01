// src/entities/Logradouro.entity.ts
import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { Bairro } from "./Bairro.entity.ts";
import { Usuario } from "./Usuario.entity.ts"; // Importa Usuário para a relação

@Entity("gt_logradouro")
export class Logradouro {
	@PrimaryColumn("varchar", { length: 8 }) // Chave Primária não-gerada
	cep: string;

	@Column("varchar", { length: 100 })
	logradouro: string; // Nome da rua/avenida

	// Relação: Muitos Logradouros (CEPs) pertencem a um Bairro
	@ManyToOne(
		() => Bairro,
		(bairro) => bairro.logradouros,
	)
	@JoinColumn({ name: "id_bairro" }) // Chave estrangeira
	id_bairro: Bairro;

	// Relação: Um Logradouro (CEP) pode ter muitos Usuários
	@OneToMany(
		() => Usuario,
		(usuario) => usuario.logradouro,
	)
	usuarios: Usuario[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
