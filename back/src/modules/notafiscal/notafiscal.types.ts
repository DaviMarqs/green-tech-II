export interface CreateNotaFiscalDTO {
  nome_destinatario?: string;
  email_destinatario?: string;
  endereco_destinatario?: string;
  cpf_cnpj_destinatario?: string;

  nome_razao_emitente?: string;
  cnpj_emitente?: string;
  email_emitente?: string;

  id_pedido: number;
}

export interface UpdateNotaFiscalDTO extends Partial<CreateNotaFiscalDTO> {}
