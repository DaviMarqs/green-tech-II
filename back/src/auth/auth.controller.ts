// src/auth/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.ts";
import type {
	RegisterUserDTO,
	LoginDTO,
	AuthResponse,
	RegisterResponse,
} from "./auth.types.ts";
// Importa o tipo de erro padrão que já criamos
import type { ErrorResponse } from "../users/users.types.ts";

export const registerController = async (
	req: Request<unknown, unknown, RegisterUserDTO>,
	res: Response<RegisterResponse | ErrorResponse>,
	next: NextFunction,
) => {
	try {
		const userData = req.body;

		// A validação de campos obrigatórios é boa,
		// mas o ideal é movê-la para o service ou usar uma lib (ex: Zod)
		if (!userData.nome || !userData.email || !userData.senha || !userData.cpf) {
			return res.status(400).json({ message: "Dados obrigatórios ausentes." });
		}

		const newUser = await authService.register(userData);

		res.status(201).json({
			message: "Usuário criado com sucesso!",
			user: newUser,
		});
	} catch (err) {
		next(err); // Deixa o middleware de erro (AppError) lidar com isso
	}
};

export const loginController = async (
	req: Request<unknown, unknown, LoginDTO>,
	res: Response<AuthResponse | ErrorResponse>,
	next: NextFunction,
) => {
	try {
		const loginData = req.body;

		if (!loginData.email || !loginData.senha) {
			return res
				.status(400)
				.json({ message: "E-mail e senha são obrigatórios." });
		}

		const authResult = await authService.login(loginData);

		res.status(200).json({
			message: "Login bem-sucedido!",
			...authResult,
		});
	} catch (err) {
		next(err); // Deixa o middleware de erro (AppError) lidar com isso
	}
};
