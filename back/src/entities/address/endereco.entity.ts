import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Estado } from "./estado.entity";
import { Cidade } from "./cidade.entity";
import { Usuario } from "../user/users.entity";

@Entity("gt_endereco")
export class Endereco {
  @PrimaryGeneratedColumn()
  id_endereco: number;

  @Column({ length: 120 })
  logradouro: string;

  @Column({ type: "integer", nullable: true })
  numero?: number;

  @Column({ length: 100 })
  bairro: string;

  @Column()
  id_estado: number;

  @ManyToOne(() => Estado, (estado) => estado.enderecos)
  @JoinColumn({ name: "id_estado" })
  estado: Estado;

  @Column()
  id_cidade: number;

  @ManyToOne(() => Cidade, (cidade) => cidade.enderecos)
  @JoinColumn({ name: "id_cidade" })
  cidade: Cidade;

  @Column({ length: 14, nullable: true })
  cep: string;

  @Column()
  user_id: number;

  @ManyToOne(() => Usuario, (user) => user.endereco)
  @JoinColumn({ name: "user_id" })
  usuario: Usuario;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
