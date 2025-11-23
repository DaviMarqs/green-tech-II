import { Request, Response, NextFunction } from "express";
import * as service from "./notafiscal.service";
import PDFDocument from "pdfkit";

const formatDateTimeBr = (value?: string | Date | null) => {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const createNotaFiscalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.createNotaFiscal(req.body);
    res.status(201).json(nota);
  } catch (err) {
    next(err);
  }
};

export const listNotasFiscaisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notas = await service.listNotasFiscais();
    res.json(notas);
  } catch (err) {
    next(err);
  }
};

export const getNotaFiscalByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.getNotaFiscalById(Number(req.params.id));
    res.json(nota);
  } catch (err) {
    next(err);
  }
};

export const updateNotaFiscalController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.updateNotaFiscal(
      Number(req.params.id),
      req.body
    );
    res.json(nota);
  } catch (err) {
    next(err);
  }
};

export const deleteNotaFiscalController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await service.deleteNotaFiscal(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getNotaFiscalPdfController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const nfNumero = Number(req.params.id);
    const nota = await service.getNotaFiscalById(nfNumero);
    const pedido = nota.pedido;

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=nota-fiscal-${nota.nf_numero}.pdf`
    );

    doc.pipe(res);

    // ============================================
    // CABEÇALHO COM BORDA
    // ============================================
    const pageWidth = doc.page.width - 80;
    let currentY = 40;

    doc.rect(40, currentY, pageWidth, 100).stroke();

    // Título centralizado
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("NOTA FISCAL ELETRÔNICA", 40, currentY + 15, {
        width: pageWidth,
        align: "center",
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Nº ${nota.nf_numero}`, 40, currentY + 40, {
        width: pageWidth,
        align: "center",
      });

    doc
      .fontSize(8)
      .text(
        `Emitida em: ${formatDateTimeBr(nota.created_at)}`,
        40,
        currentY + 55,
        {
          width: pageWidth,
          align: "center",
        }
      );

    // if (nota.chave_acesso) {
    //   doc
    //     .fontSize(7)
    //     .text(`Chave de Acesso: ${nota.chave_acesso}`, 40, currentY + 70, {
    //       width: pageWidth,
    //       align: "center",
    //     });
    // }

    currentY += 110;

    // ============================================
    // DADOS DO EMITENTE
    // ============================================
    doc.rect(40, currentY, pageWidth, 80).stroke();

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("EMITENTE", 45, currentY + 5);

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Razão Social: ${nota.nome_razao_emitente ?? ""}`,
        45,
        currentY + 20
      )
      .text(`CNPJ: ${nota.cnpj_emitente ?? ""}`, 45, currentY + 35)
      .text(`E-mail: ${nota.email_emitente ?? ""}`, 45, currentY + 50);

    // if (nota.endereco_emitente) {
    //   doc.text(`Endereço: ${nota.endereco_emitente}`, 45, currentY + 65);
    // }

    currentY += 90;

    // ============================================
    // DADOS DO DESTINATÁRIO
    // ============================================
    doc.rect(40, currentY, pageWidth, 80).stroke();

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DESTINATÁRIO", 45, currentY + 5);

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(`Nome: ${nota.nome_destinatario ?? ""}`, 45, currentY + 20)
      .text(`CPF/CNPJ: ${nota.cpf_cnpj_destinatario ?? ""}`, 45, currentY + 35)
      .text(`E-mail: ${nota.email_destinatario ?? ""}`, 45, currentY + 50)
      .text(`Endereço: ${nota.endereco_destinatario ?? ""}`, 45, currentY + 65);

    currentY += 90;

    // ============================================
    // DADOS DO PEDIDO
    // ============================================
    doc.rect(40, currentY, pageWidth, 60).stroke();

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DADOS DO PEDIDO", 45, currentY + 5);

    const col1X = 45;
    const col2X = pageWidth / 2 + 40;

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Pedido Nº: ${pedido?.id_pedido ?? nota.id_pedido}`,
        col1X,
        currentY + 20
      )
      .text(
        `Status: ${pedido?.status ?? "Não informado"}`,
        col1X,
        currentY + 35
      )
      .text(
        `Forma Pagamento: ${pedido?.forma_pagamento ?? "-"}`,
        col2X,
        currentY + 20
      )
      .text(`Parcelas: ${pedido?.parcelas ?? "-"}`, col2X, currentY + 35);

    if (pedido?.data_pedido) {
      doc.text(
        `Data Pedido: ${formatDateTimeBr(pedido.data_pedido)}`,
        col2X,
        currentY + 50
      );
    }

    currentY += 70;

    // ============================================
    // TABELA DE PRODUTOS
    // ============================================
    if (pedido && Array.isArray((pedido as any).produtos)) {
      const produtos = (pedido as any).produtos as Array<{
        quantidade: number;
        produto: { nome: string; preco: string; descricao?: string };
      }>;

      // Cabeçalho da tabela
      doc.rect(40, currentY, pageWidth, 20).fill("#f0f0f0").stroke();

      doc
        .fillColor("#000")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("Produto", 45, currentY + 6, { width: 220, continued: false })
        .text("Qtd", 270, currentY + 6, { width: 50, align: "center" })
        .text("Valor Unit.", 325, currentY + 6, { width: 80, align: "right" })
        .text("Total", 410, currentY + 6, { width: 80, align: "right" });

      currentY += 20;

      let totalGeral = 0;

      produtos.forEach((item) => {
        const unit = Number(item.produto.preco);
        const subtotal = unit * item.quantidade;
        totalGeral += subtotal;

        // Verifica se precisa de nova página
        if (currentY > 700) {
          doc.addPage();
          currentY = 40;
        }

        doc.rect(40, currentY, pageWidth, 25).stroke();

        doc
          .fontSize(8)
          .font("Helvetica")
          .text(item.produto.nome, 45, currentY + 5, { width: 220 })
          .text(String(item.quantidade), 270, currentY + 5, {
            width: 50,
            align: "center",
          })
          .text(`R$ ${unit.toFixed(2)}`, 325, currentY + 5, {
            width: 80,
            align: "right",
          })
          .text(`R$ ${subtotal.toFixed(2)}`, 410, currentY + 5, {
            width: 80,
            align: "right",
          });

        currentY += 25;
      });

      // Total
      doc.rect(40, currentY, pageWidth, 25).fill("#f0f0f0").stroke();

      doc
        .fillColor("#000")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("VALOR TOTAL DA NOTA", 45, currentY + 7)
        .text(`R$ ${totalGeral.toFixed(2)}`, 410, currentY + 7, {
          width: 80,
          align: "right",
        });

      currentY += 35;
    } else {
      // Sem produtos, mostra apenas o valor total
      doc.rect(40, currentY, pageWidth, 25).fill("#f0f0f0").stroke();

      doc
        .fillColor("#000")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("VALOR TOTAL DA NOTA", 45, currentY + 7)
        .text(`R$ ${pedido?.valor ?? "0,00"}`, 410, currentY + 7, {
          width: 80,
          align: "right",
        });

      currentY += 35;
    }

    // ============================================
    // RODAPÉ
    // ============================================
    const footerY = doc.page.height - 80;

    doc
      .fontSize(7)
      .font("Helvetica")
      .fillColor("#666")
      .text(
        "Este documento é uma representação simplificada de uma Nota Fiscal Eletrônica.",
        40,
        footerY,
        { width: pageWidth, align: "center" }
      )
      .text(
        `Documento gerado em ${formatDateTimeBr(new Date())}`,
        40,
        footerY + 12,
        { width: pageWidth, align: "center" }
      );

    doc.end();
  } catch (err) {
    next(err);
  }
};
