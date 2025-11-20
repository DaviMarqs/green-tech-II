import type { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import * as userService from "./users.service";

// Buscar dados do perfil
export const getProfileController = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: "Não autenticado." });
	}

	try {
		const userProfile = await userService.getUserProfile(userId);
		return res.status(200).json(userProfile);
	} catch (error) {
		if (error instanceof AppError)
			return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ message: "Erro interno." });
	}
};

// Atualizar Usuário
export const updateController = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const userIdFromToken = req.user?.id;
	const userData = req.body;

	if (!userIdFromToken || id !== userIdFromToken) {
		return res.status(403).json({
			message: "Acesso negado. Você só pode alterar seus próprios dados.",
		});
	}

	try {
		const update = await userService.updateUser(id, userData);
		return res.status(200).json(update);
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erro desconhecido" });
	}
};

export const deactivateController = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const userIdFromToken = req.user?.id;

	if (!userIdFromToken || id !== userIdFromToken) {
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

export const resetPasswordController = async (req: Request, res: Response) => {
	const { email, senha } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ message: "Dados inválidos!" });
	}

	try {
		await userService.resetPassword(email, senha);
		return res.status(200).json({ message: "Senha alterada com sucesso!" });
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erro interno no servidor." });
	}
};
