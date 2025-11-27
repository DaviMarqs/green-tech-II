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
    if (!user) {
      setFormError("Você precisa estar logado para avaliar.");
      return;
    }

    if (newRating === 0) {
      setFormError("Por favor, selecione uma nota de 1 a 5.");
      return;
    }

    // 🚫 Não deixa criar nova avaliação se o usuário já tiver uma
    const existingReview = reviews?.find(
      (review) => review.id_usuario === user.id_usuario
    );

    // Se já existe avaliação e não estamos editando, bloqueia
    if (!editingId && existingReview) {
      setFormError(
        "Você já avaliou este produto. Edite sua avaliação existente."
      );
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
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setFormError("Você já avaliou este produto.");
      } else {
        setFormError("Erro ao enviar avaliação.");
      }
    }
  };

  return (
    <div
      className="space-y-6 sm:space-y-8 mt-8 sm:mt-10 border-t pt-6 sm:pt-8"
      id="reviews-section"
    >
      {/* Título da seção */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <MessageSquare className="size-5 sm:size-6" /> Avaliações
      </h2>

      {/* Card de média geral */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
        <div className="text-center">
          <span className="text-4xl sm:text-5xl font-bold text-gray-800">
            {mediaGeral.toFixed(1)}
          </span>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">de 5.0</div>
        </div>
        <div className="h-px w-full sm:h-12 sm:w-px bg-gray-300 sm:mx-2" />
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <StarRating
            rating={Math.round(mediaGeral)}
            size={20}
            className="sm:hidden"
          />
          <StarRating
            rating={Math.round(mediaGeral)}
            size={24}
            className="hidden sm:flex"
          />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {total} {total === 1 ? "opinião" : "opiniões"}
          </span>
        </div>
      </div>

      {/* Formulário de avaliação */}
      {user ? (
        <Card
          id="review-form"
          className={`border-dashed border-2 shadow-none transition-colors ${
            editingId
              ? "border-blue-300 bg-blue-50/30"
              : "border-gray-200 bg-gray-50/50"
          }`}
        >
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              {editingId ? "Editar sua avaliação" : "Deixe sua avaliação"}
            </CardTitle>
            {editingId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-red-500 text-xs sm:text-sm"
              >
                <X className="size-3 sm:size-4 mr-1 sm:mr-2" /> Cancelar edição
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Sua nota:
              </span>
              <StarRating
                rating={newRating}
                onRatingChange={setNewRating}
                size={24}
                className="sm:hidden"
              />
              <StarRating
                rating={newRating}
                onRatingChange={setNewRating}
                size={28}
                className="hidden sm:flex"
              />
            </div>
            <Textarea
              placeholder="O que você achou do produto?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="bg-white text-sm sm:text-base"
            />
            {formError && (
              <p className="text-red-500 text-xs sm:text-sm">{formError}</p>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting || newRating === 0}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto sm:min-w-[150px] text-xs sm:text-sm py-2 sm:py-2.5"
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
        <div className="bg-blue-50 text-blue-800 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-center border border-blue-100">
          Faça login para avaliar este produto.
        </div>
      )}

      {/* Lista de avaliações */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm sm:text-base">
            Carregando avaliações...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic text-sm sm:text-base">
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-0 mb-2">
                    {/* Informações do usuário */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                        <User className="size-4 sm:size-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          {review.usuario_nome}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {new Date(review.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {/* Avaliação e ações */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      <StarRating
                        rating={review.nota}
                        size={14}
                        className="sm:hidden"
                      />
                      <StarRating
                        rating={review.nota}
                        size={16}
                        className="hidden sm:flex"
                      />

                      {isOwner && !deleting && (
                        <div className="flex items-center border-l pl-2 sm:pl-3 gap-0.5 sm:gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-blue-600"
                            onClick={() => handleEditClick(review)}
                          >
                            <Pencil className="size-3 sm:size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-red-600"
                            onClick={() => openDeleteModal(review.id_avaliacao)}
                          >
                            <Trash2 className="size-3 sm:size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comentário */}
                  <p className="text-gray-700 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed pl-0 sm:pl-[52px]">
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

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Tem certeza?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Essa ação não pode ser desfeita. Isso excluirá permanentemente sua
              avaliação deste produto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setReviewToDelete(null)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto text-xs sm:text-sm"
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
