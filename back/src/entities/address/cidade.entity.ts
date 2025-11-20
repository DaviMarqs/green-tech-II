import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Estado } from "./estado.entity";
import { Endereco } from "./endereco.entity";

@Entity("gt_cidade")
export class Cidade {
  @PrimaryGeneratedColumn()
  id_cidade: number;

  @Column({ length: 100 })
  nome_cidade: string;

  @Column()
  id_estado: number;

  @ManyToOne(() => Estado, (estado) => estado.cidades)
  @JoinColumn({ name: "id_estado" })
  estado: Estado;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => Endereco, (endereco) => endereco.cidade)
  enderecos: Endereco[];
}
