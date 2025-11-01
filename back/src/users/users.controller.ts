// src/users/users.controller.ts

import type { Response } from "express";
import * as userService from "./users.service.js";
import { AppError } from "../errors/AppError.js";
import type {
	AuthRequest,
	UpdateUserDTO,
	UserResponse,
	ErrorResponse,
} from "./users.types.js";

export const updateController = async (
	req: AuthRequest<{ id: string }, UpdateUserDTO>,
	res: Response<UserResponse | ErrorResponse>,
) => {
	const id = Number(req.params.id);
	const userData = req.body;

	if (Number(id) !== req.user.id) {
		return res.status(403).json({
			message: "Acesso negado. Você só pode alterar seus próprios dados.",
		});
	}

	try {
		const update = await userService.updateUser(id, userData);

		// O TS agora sabe que 'update' é UserResponse
		return res.status(200).json(update);
	} catch (error) {
		// ... (lógica de tratamento de erro)
		if (error instanceof AppError) {
			// O TS sabe que { message: ... } bate com ErrorResponse
			return res.status(error.statusCode).json({ message: error.message });
		}
		// ...
		return res.status(500).json({ message: "Erro desconhecido" });
	}
};

export const deactivateController = async (
	req: AuthRequest<{ id: string }, unknown>,
	res: Response<undefined | ErrorResponse>,
) => {
	const id = Number(req.params.id);

	if (Number(id) !== req.user.id) {
		return res.status(403).json({ message: "Acesso negado" });
	}

	try {
		await userService.deactivateUser(id);

		return res.status(204).send();
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erro desconhecido" });
	}
};
