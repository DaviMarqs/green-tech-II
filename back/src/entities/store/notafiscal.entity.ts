import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Pedido } from "./order.entity";

@Entity("gt_notafiscal")
export class NotaFiscal {
  @PrimaryGeneratedColumn()
  nf_numero: number;

  @Column({ length: 100, nullable: true })
  nome_destinatario: string;

  @Column({ length: 100, nullable: true })
  email_destinatario: string;

  @Column({ length: 200, nullable: true })
  endereco_destinatario: string;

  @Column({ length: 14, nullable: true })
  cpf_cnpj_destinatario: string;

  @Column({ length: 100, nullable: true })
  nome_razao_emitente: string;

  @Column({ length: 14, nullable: true })
  cnpj_emitente: string;

  @Column({ length: 100, nullable: true })
  email_emitente: string;

  @Column()
  id_pedido: number;

  @ManyToOne(() => Pedido)
  @JoinColumn({ name: "id_pedido" })
  pedido: Pedido;

  @CreateDateColumn()
  created_at: Date;
}
