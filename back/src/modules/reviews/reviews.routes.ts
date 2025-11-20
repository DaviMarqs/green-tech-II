import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
	createReviewController,
	deleteReviewController,
	listByProductController,
	updateReviewController,
} from "./reviews.controller";

const reviewsRoutes = Router();

// Rota Pública: Listar avaliações de um produto
// Exemplo: GET /reviews/product/1?page=1&limit=5
reviewsRoutes.get("/product/:produtoId", listByProductController);

reviewsRoutes.use(protect);

reviewsRoutes.post("/", createReviewController);
reviewsRoutes.put("/:id", updateReviewController); // :id é o id da avaliação
reviewsRoutes.delete("/:id", deleteReviewController);

export default reviewsRoutes;
