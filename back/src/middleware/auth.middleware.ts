// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import type { AuthenticatedUser } from "../users/users.types.ts";

export const protect = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new AppError("Token não fornecido ou mal formatado.", 401);
	}

	const token = authHeader.split(" ")[1];

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new AppError(
			"Chave de autenticação não configurada no servidor.",
			500,
		);
	}

	try {
		const dataUser = jwt.verify(token, secret) as JwtPayload;

		if (typeof dataUser === "string" || !dataUser.id) {
			throw new AppError("Token inválido ou não contém o ID do usuário.", 401);
		}

		const user: AuthenticatedUser = {
			id: Number(dataUser.id),
		};

		Object.assign(req, { user: user });

		next();
	} catch (error) {
		throw new AppError("Token inválido ou expirado.", 401);
	}
};
