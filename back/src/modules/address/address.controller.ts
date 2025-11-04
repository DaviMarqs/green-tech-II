import type { Request, Response, NextFunction } from "express";
import type {
	RegisterEnderecoDTO,
	RegisterEnderecoResponse,
} from "./address.types";
import type { ErrorResponse } from "../users/users.types";
import { createCompleto } from "./address.service";

export const createEnderecoController = async (
	req: Request<unknown, unknown, RegisterEnderecoDTO>,
	res: Response<RegisterEnderecoResponse | ErrorResponse>,
	next: NextFunction,
) => {
	try {
		const enderecoData = req.body;

		if (
			!enderecoData.numero ||
			!enderecoData.logradouro ||
			!enderecoData.bairro ||
			!enderecoData.cidade ||
			!enderecoData.estado
		) {
			return res.status(400).json({ message: "Dados obrigatórios ausentes." });
		}

		const novoEndereco = await createCompleto(enderecoData);

		res.status(201).json({
			message: "Endereço criado com sucesso!",
			endereco: novoEndereco,
		});
	} catch (err) {
		next(err);
	}
};
