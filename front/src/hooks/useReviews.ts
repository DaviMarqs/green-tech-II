import {
	type CreateReviewDTO,
	type Review,
	type UpdateReviewDTO,
	reviewsService,
} from "@/services/reviews.service";
import { useCallback, useEffect, useRef, useState } from "react";

type ReviewsState = {
	loading: boolean;
	error: Error | null;
	data: Review[];
	mediaGeral: number;
	total: number;
};

// Hook de Listagem
export function useReviews(productId?: number) {
	const abortRef = useRef<AbortController | null>(null);
	const [state, setState] = useState<ReviewsState>({
		loading: true,
		error: null,
		data: [],
		mediaGeral: 0,
		total: 0,
	});

	const refetch = useCallback(
		(page = 1) => {
			if (!productId) return;

			abortRef.current?.abort();
			const ctrl = new AbortController();
			abortRef.current = ctrl;

			setState((prev) => ({ ...prev, loading: true, error: null }));

			reviewsService
				.listByProduct(productId, page, 10, ctrl.signal)
				.then((res) => {
					setState({
						loading: false,
						error: null,
						data: res.data,
						mediaGeral: Number(res.meta.mediaGeral),
						total: res.meta.total,
					});
				})
				.catch((err) => {
					if (err.name === "AbortError") return;
					setState((prev) => ({
						...prev,
						loading: false,
						error: err as Error,
					}));
				});
		},
		[productId],
	);

	useEffect(() => {
		refetch();
		return () => abortRef.current?.abort();
	}, [refetch]);

	return { ...state, refetch };
}

// Hook de Criação
export function useCreateReview() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const mutate = useCallback(async (payload: CreateReviewDTO) => {
		setLoading(true);
		setError(null);
		try {
			const created = await reviewsService.create(payload);
			return created;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, createReview: mutate };
}

// Hook de Atualização
export function useUpdateReview() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const mutate = useCallback(async (id: number, payload: UpdateReviewDTO) => {
		setLoading(true);
		setError(null);
		try {
			const updated = await reviewsService.update(id, payload);
			return updated;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, updateReview: mutate };
}

// Hook de Deleção
export function useDeleteReview() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const mutate = useCallback(async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			await reviewsService.delete(id);
			return true;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, deleteReview: mutate };
}
