import { AppDataSource } from "../../database/data-source";
import { Avaliacao } from "../../entities/store/review.entity";
import { Produto } from "../../entities/store/product.entity";
import { Usuario } from "../../entities/user/users.entity";
import { AppError } from "../../errors/AppError";
import type {
	CreateReviewDTO,
	PaginatedReviewsResponse,
	UpdateReviewDTO,
} from "./reviews.types";

const reviewRepository = AppDataSource.getRepository(Avaliacao);
const productRepository = AppDataSource.getRepository(Produto);

export const createReview = async (
	userId: number,
	dto: CreateReviewDTO,
): Promise<Avaliacao> => {
	// Verifica se produto existe
	const product = await productRepository.findOne({
		where: { id: dto.produtoId },
	});
	if (!product) {
		throw new AppError("Produto não encontrado.", 404);
	}

	// Validar com o time se essa regra faz sentido
	// const avaliacaoExistente = await reviewRepository.findOne({
	//   where: {
	//     id_usuario: userId,
	//     id_produto: dto.produtoId,
	//   },
	// });

	// if (avaliacaoExistente) {
	//   // Retornamos 409 (Conflict) indicando que o recurso já existe
	//   throw new AppError("Você já avaliou este produto. Edite sua avaliação existente.", 409);
	// }

	// 2. Verifica se nota é válida
	if (dto.nota < 0 || dto.nota > 5) {
		throw new AppError("A nota deve ser entre 0 e 5.", 400);
	}

	const review = reviewRepository.create({
		id_usuario: userId,
		id_produto: dto.produtoId,
		nota: dto.nota,
		descricao: dto.descricao,
	});

	return await reviewRepository.save(review);
};

export const listReviewsByProduct = async (
	produtoId: number,
	page = 1,
	limit = 10,
): Promise<PaginatedReviewsResponse> => {
	const skip = (page - 1) * limit;

	// Buscar avaliações com paginação e dados do usuário
	const [reviews, total] = await reviewRepository.findAndCount({
		where: { id_produto: produtoId },
		relations: ["usuario"], // Para pegar o nome de quem avaliou
		order: { created_at: "DESC" },
		take: limit,
		skip: skip,
	});

	// 2. Calcular Média do Produto
	const { average } = await reviewRepository
		.createQueryBuilder("review")
		.select("AVG(review.nota)", "average")
		.where("review.id_produto = :id", { id: produtoId })
		.getRawOne();

	const formattedReviews = reviews.map((r) => ({
		id_avaliacao: r.id_avaliacao,
		nota: r.nota,
		descricao: r.descricao,
		usuario_nome: r.usuario ? r.usuario.nome : "Usuário Desconhecido",
		data: r.created_at,
		id_usuario: r.id_usuario,
	}));

	return {
		data: formattedReviews,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			mediaGeral: Number.parseFloat(average) || 0, // Se não tiver reviews, retorna 0
		},
	};
};

export const updateReview = async (
	userId: number,
	reviewId: number,
	dto: UpdateReviewDTO,
): Promise<Avaliacao> => {
	const review = await reviewRepository.findOne({
		where: { id_avaliacao: reviewId },
	});

	if (!review) throw new AppError("Avaliação não encontrada.", 404);

	// Verifica se quem está tentando editar é o dono da avaliação
	if (review.id_usuario !== userId) {
		throw new AppError(
			"Você não tem permissão para editar esta avaliação.",
			403,
		);
	}

	if (dto.nota !== undefined && (dto.nota < 0 || dto.nota > 5)) {
		throw new AppError("A nota deve ser entre 0 e 5.", 400);
	}

	reviewRepository.merge(review, dto);
	return await reviewRepository.save(review);
};

export const deleteReview = async (
	userId: number,
	reviewId: number,
): Promise<void> => {
	const review = await reviewRepository.findOne({
		where: { id_avaliacao: reviewId },
	});

	if (!review) throw new AppError("Avaliação não encontrada.", 404);

	if (review.id_usuario !== userId) {
		throw new AppError(
			"Você não tem permissão para excluir esta avaliação.",
			403,
		);
	}

	await reviewRepository.remove(review);
};
