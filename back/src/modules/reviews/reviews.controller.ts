import type { Response, Request } from "express";
import { AppError } from "../../errors/AppError";
import * as reviewService from "./reviews.service";

export const createReviewController = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			throw new AppError("Usuário não autenticado.", 401);
		}

		const { produtoId, nota, descricao } = req.body;

		if (!produtoId || nota === undefined) {
			return res
				.status(400)
				.json({ message: "Produto ID e Nota são obrigatórios." });
		}

		const review = await reviewService.createReview(userId, {
			produtoId,
			nota,
			descricao,
		});
		return res.status(201).json(review);
	} catch (error) {
		if (error instanceof AppError)
			return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ message: "Erro interno." });
	}
};

export const listByProductController = async (req: Request, res: Response) => {
	try {
		const { produtoId } = req.params;
		const { page, limit } = req.query;

		const result = await reviewService.listReviewsByProduct(
			Number(produtoId),
			Number(page) || 1,
			Number(limit) || 5,
		);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao buscar avaliações." });
	}
};

export const updateReviewController = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			throw new AppError("Usuário não autenticado.", 401);
		}

		const { id } = req.params; // ID da avaliação
		const dto = req.body;

		const updated = await reviewService.updateReview(userId, Number(id), dto);
		return res.status(200).json(updated);
	} catch (error) {
		if (error instanceof AppError)
			return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ message: "Erro interno." });
	}
};

export const deleteReviewController = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			throw new AppError("Usuário não autenticado.", 401);
		}

		const { id } = req.params;

		await reviewService.deleteReview(userId, Number(id));
		return res.status(204).send();
	} catch (error) {
		if (error instanceof AppError)
			return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ message: "Erro interno." });
	}
};
