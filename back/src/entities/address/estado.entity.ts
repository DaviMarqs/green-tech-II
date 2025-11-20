import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Cidade } from "./cidade.entity";
import { Endereco } from "./endereco.entity";

@Entity("gt_estado")
export class Estado {
  @PrimaryGeneratedColumn()
  id_estado: number;

  @Column({ length: 100 })
  nome_estado: string;

  @Column({ length: 2 })
  sigla: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // Relações
  @OneToMany(() => Cidade, (cidade) => cidade.estado)
  cidades: Cidade[];

  @OneToMany(() => Endereco, (endereco) => endereco.estado)
  enderecos: Endereco[];
}
