// src/entities/endereco.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { Logradouro } from "./logradouro.entity";

@Entity("gt_endereco")
export class Endereco {
	@PrimaryGeneratedColumn("increment", { name: "id_endereco" })
	id_endereco: number;

	@Column("varchar", { length: 10 })
	numero: string;

	@Column("varchar", { length: 100, nullable: true })
	complemento: string;

	@ManyToOne(
		() => Logradouro,
		(logradouro) => logradouro.enderecos,
	)
	@JoinColumn({ name: "cep" })
	cep: Logradouro;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
