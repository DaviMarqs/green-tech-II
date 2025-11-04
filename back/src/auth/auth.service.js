import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../pg.js";
import { AppError } from "../errors/AppError.js";

export const register = async ({
	nome,
	cpf,
	email,
	senha,
	telefone,
	cep,
	data_nasc,
}) => {
	const userExists = await pool.query(
		"SELECT id_usuario FROM gt_usuario WHERE email = $1 OR cpf_cnpj = $2",
		[email, cpf],
	);

	if (userExists.rowCount > 0) {
		throw new AppError("E-mail ou CPF já cadastrado.", 409);
	}

	const salt = 10;
	const passwordHash = await bcrypt.hash(senha, salt);

	const [dia, mes, ano] = data_nasc.split("/");

	const dataFormatada = `${ano}-${mes}-${dia}`;

	const sql = `
    INSERT INTO gt_usuario (nome, cpf_cnpj, email, senha, telefone, cep, data_nasc)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id_usuario, nome, email;
  `;
	const values = [
		nome,
		cpf,
		email,
		passwordHash,
		telefone,
		"13510000",
		dataFormatada,
	];
	const { rows } = await pool.query(sql, values);
	return rows[0];
};

export const login = async ({ email, senha }) => {
	const result = await pool.query(
		"SELECT id_usuario, nome, email, senha FROM gt_usuario WHERE email = $1 AND disabled_at IS NULL",
		[email],
	);
	const user = result.rows[0];

	if (!user) {
		throw new AppError("Credenciais inválidas.", 401);
	}

	const passwordCorrect = await bcrypt.compare(senha, user.senha);
	if (!passwordCorrect) {
		throw new AppError("Credenciais inválidas.", 401);
	}

	const token = jwt.sign(
		{ id: user.id_usuario, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "8h" },
	);

	const { senha: _, ...userResponse } = user;
	return { user: userResponse, token };
};
