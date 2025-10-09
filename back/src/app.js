import express from "express";
import { pool } from "./pg.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({ message: "Erro interno" });
});

app.post("/auth/register", async (req, res) => {
	try {
		const { body } = req;
		const sql = `INSERT INTO gt_usuario (nome, cpf_cnpj, email, senha, telefone, cep)
    VALUES ('${body.name}', '${body.cpf}', '${body.email}', '${body.senha}', '${body.telefone}', '${body.cep}')`;
		console.log("sql", sql);
		console.log(body, "body");
		const { rows } = await pool.query(sql);
	} catch (err) {
		console.log(err);
	}

	res.json({ status: "usuario criado com sucesso!" });
});

export default app;
