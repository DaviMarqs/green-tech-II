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
import { Usuario } from "../user/users.entity";
import { Bairro } from "./bairro.entity";
import { Endereco } from "./endereco.entity";

@Entity("gt_logradouro")
export class Logradouro {
	@PrimaryColumn("varchar", { length: 8 })
	cep: string;

	@Column("varchar", { length: 100 })
	logradouro: string;

	@ManyToOne(
		() => Bairro,
		(bairro) => bairro.logradouros,
	)
	@JoinColumn({ name: "id_bairro" })
	id_bairro: Bairro;

	@OneToMany(
		() => Usuario,
		(usuario) => usuario.logradouro,
	)
	usuarios: Usuario[];

	@OneToMany(
		() => Endereco,
		(endereco) => endereco.cep,
	)
	enderecos: Endereco[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
