import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError.js";
import { pool } from "../pg.js";

export const updateUser = async (id, userData) => {
	const { nome, telefone, cep } = userData;

	const userExists = await pool.query(
		"SELECT * FROM gt_usuario WHERE id_usuario = $1 AND disabled_at IS NULL",
		[id],
	);

	if (userExists.rowCount === 0) {
		throw new AppError("Usuário não encontrado ou desativado.", 404);
	}

	const fieldsToUpdate = []; //Guarda os campos a serem atualizados
	const values = []; //Guarda os novos valores alterados
	let paramIndex = 1; //Contador de placeholder de parâmetros(Evita Sql injection)

	if (nome) {
		fieldsToUpdate.push(`nome = $${paramIndex++}`);
		values.push(nome);
	}
	if (telefone) {
		fieldsToUpdate.push(`telefone = $${paramIndex++}`);
		values.push(telefone);
	}
	if (cep) {
		fieldsToUpdate.push(`cep = $${paramIndex++}`);
		values.push(cep);
	}

	if (fieldsToUpdate.length === 0) {
		throw new AppError("Nenhum campo fornecido para atualização.", 400);
	}

	values.push(id);

	const sql = `
    UPDATE gt_usuario
    SET ${fieldsToUpdate.join(", ")}
    WHERE id_usuario = $${paramIndex}
    RETURNING id_usuario, nome, email, telefone, cep;
  `;

	const { rows } = await pool.query(sql, values);
	return rows[0];
};

export const deactivateUser = async (id) => {
	const result = await pool.query(
		`
    UPDATE gt_usuario 
    SET disabled_at = NOW() 
    WHERE id_usuario = $1 AND disabled_at IS NULL
    RETURNING id_usuario, disabled_at;
    `,
		[id],
	);

	if (result.rowCount === 0) {
		throw new AppError("Usuário não encontrado ou desativado.", 404);
	}

	return { message: "Usuário desativado com sucesso." };
};

export const resetPassword = async (email, senha) => {
	const userExists = await pool.query(
		"SELECT * FROM gt_usuario WHERE email = $1 AND disabled_at IS NULL",
		[email],
	);

	if (userExists.rowCount === 0) {
		throw new AppError("Usuário não encontrado ou desativado.", 404);
	}

	const salt = 10;
	const passwordHash = await bcrypt.hash(senha, salt);

	const sql = `
    UPDATE gt_usuario
    SET senha='${passwordHash}'
    WHERE email = '${email}'
  `;

	const { rows } = await pool.query(sql);
	return rows[0];
};
