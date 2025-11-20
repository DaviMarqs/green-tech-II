import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
	useCreateReview,
	useDeleteReview,
	useReviews,
	useUpdateReview,
} from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { StarRating } from "./starRating";
import { MessageSquare, Pencil, Trash2, User, X } from "lucide-react";

interface ProductReviewsProps {
	productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
	const { user } = useAuth();

	const {
		data: reviews,
		mediaGeral,
		total,
		loading,
		refetch,
	} = useReviews(productId);
	const { createReview, loading: creating } = useCreateReview();
	const { updateReview, loading: updating } = useUpdateReview();
	const { deleteReview, loading: deleting } = useDeleteReview();

	const [newRating, setNewRating] = useState(0);
	const [comment, setComment] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);

	// Estado para controlar qual ID será deletado
	const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

	const submitting = creating || updating;

	const handleEditClick = (review: any) => {
		setEditingId(review.id_avaliacao);
		setNewRating(review.nota);
		setComment(review.descricao || "");
		setFormError(null);
		document
			.getElementById("review-form")
			?.scrollIntoView({ behavior: "smooth" });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setNewRating(0);
		setComment("");
		setFormError(null);
	};

	const openDeleteModal = (reviewId: number) => {
		setReviewToDelete(reviewId);
	};

	const handleConfirmDelete = async () => {
		if (!reviewToDelete) return;

		try {
			await deleteReview(reviewToDelete);
			refetch();
			if (editingId === reviewToDelete) handleCancelEdit();
			toast.success("Avaliação removida", {
				description: "Sua avaliação foi excluída com sucesso.",
			});
		} catch {
			toast.error("Erro ao excluir", {
				description: "Não foi possível remover a avaliação. Tente novamente.",
			});
		} finally {
			setReviewToDelete(null);
		}
	};

	const handleSubmit = async () => {
		if (newRating === 0) {
			setFormError("Por favor, selecione uma nota de 1 a 5.");
			return;
		}

		setFormError(null);

		try {
			if (editingId) {
				await updateReview(editingId, { nota: newRating, descricao: comment });
			} else {
				await createReview({
					produtoId: productId,
					nota: newRating,
					descricao: comment,
				});
			}
			handleCancelEdit();
			refetch();
		} catch (err) {
			if (err.response?.status === 409) {
				setFormError("Você já avaliou este produto.");
			} else {
				setFormError("Erro ao enviar avaliação.");
			}
		}
	};

	return (
		<div className="space-y-8 mt-10 border-t pt-8" id="reviews-section">
			<h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
				<MessageSquare className="size-6" /> Avaliações
			</h2>

			<div className="flex items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
				<div className="text-center">
					<span className="text-5xl font-bold text-gray-800">
						{mediaGeral.toFixed(1)}
					</span>
					<div className="text-sm text-gray-500 mt-1">de 5.0</div>
				</div>
				<div className="h-12 w-px bg-gray-300 mx-2 hidden sm:flex" />
				<div className="flex flex-col gap-1">
					<StarRating rating={Math.round(mediaGeral)} size={24} />
					<span className="text-sm text-gray-600 font-medium">
						{total} {total === 1 ? "opinião" : "opiniões"}
					</span>
				</div>
			</div>

			{user ? (
				<Card
					id="review-form"
					className={`border-dashed border-2 shadow-none transition-colors ${
						editingId
							? "border-blue-300 bg-blue-50/30"
							: "border-gray-200 bg-gray-50/50"
					}`}
				>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-lg">
							{editingId ? "Editar sua avaliação" : "Deixe sua avaliação"}
						</CardTitle>
						{editingId && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCancelEdit}
								className="text-gray-500 hover:text-red-500"
							>
								<X className="size-4 mr-2" /> Cancelar edição
							</Button>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<span className="text-sm font-medium text-gray-700">
								Sua nota:
							</span>
							<StarRating
								rating={newRating}
								onRatingChange={setNewRating}
								size={28}
							/>
						</div>
						<Textarea
							placeholder="O que você achou do produto?"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={3}
							className="bg-white"
						/>
						{formError && <p className="text-red-500 text-sm">{formError}</p>}
						<div className="flex justify-end">
							<Button
								onClick={handleSubmit}
								disabled={submitting || newRating === 0}
								className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
							>
								{submitting
									? editingId
										? "Atualizando..."
										: "Enviando..."
									: editingId
										? "Atualizar Avaliação"
										: "Enviar Avaliação"}
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm text-center border border-blue-100">
					Faça login para avaliar este produto.
				</div>
			)}

			<div className="space-y-4">
				{loading ? (
					<p className="text-gray-500">Carregando avaliações...</p>
				) : reviews.length === 0 ? (
					<p className="text-gray-500 italic">
						Este produto ainda não possui avaliações.
					</p>
				) : (
					reviews.map((review) => {
						const isOwner = user && review.id_usuario === user.id_usuario;
						return (
							<Card
								key={review.id_avaliacao}
								className={`shadow-sm border-gray-100 transition-colors ${
									editingId === review.id_avaliacao
										? "ring-2 ring-blue-200 bg-blue-50/20"
										: ""
								}`}
							>
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-2">
										<div className="flex items-center gap-3">
											<div className="bg-gray-100 p-2 rounded-full">
												<User className="size-5 text-gray-500" />
											</div>
											<div>
												<p className="text-sm font-semibold text-gray-900">
													{review.usuario_nome}
												</p>
												<p className="text-xs text-gray-500">
													{new Date(review.data).toLocaleDateString("pt-BR")}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<StarRating rating={review.nota} size={16} />
											{isOwner && !deleting && (
												<div className="flex items-center border-l pl-3 gap-1 ml-2">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-gray-400 hover:text-blue-600"
														onClick={() => handleEditClick(review)}
													>
														<Pencil className="size-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-gray-400 hover:text-red-600"
														onClick={() => openDeleteModal(review.id_avaliacao)}
													>
														<Trash2 className="size-4" />
													</Button>
												</div>
											)}
										</div>
									</div>
									<p className="text-gray-700 text-sm mt-3 leading-relaxed pl-[52px]">
										{review.descricao || (
											<span className="italic text-gray-400">
												Sem comentário.
											</span>
										)}
									</p>
								</CardContent>
							</Card>
						);
					})
				)}
			</div>

			{/* 👇 MODAL USANDO SEU COMPONENTE DIALOG EXISTENTE */}
			<Dialog
				open={!!reviewToDelete}
				onOpenChange={(open) => !open && setReviewToDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Tem certeza?</DialogTitle>
						<DialogDescription>
							Essa ação não pode ser desfeita. Isso excluirá permanentemente sua
							avaliação deste produto.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						{/* Botão de Cancelar */}
						<Button variant="outline" onClick={() => setReviewToDelete(null)}>
							Cancelar
						</Button>
						{/* Botão de Excluir (Vermelho) */}
						<Button
							className="bg-red-600 hover:bg-red-700 text-white"
							onClick={handleConfirmDelete}
							disabled={deleting}
						>
							{deleting ? "Excluindo..." : "Sim, excluir"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
