import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const protect = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new AppError("Token não fornecido ou mal formatado.", 401);
	}

	const token = authHeader.split(" ")[1];

	try {
		const dataUser = jwt.verify(token, process.env.JWT_SECRET); //Verifica se o token do usuario é valido
		req.user = { id: dataUser.id };
		next();
	} catch (error) {
		throw new AppError("Token inválido.", 401);
	}
};
