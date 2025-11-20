import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	onRatingChange?: (rating: number) => void;
	size?: number;
	className?: string;
}

export function StarRating({
	rating,
	maxRating = 5,
	onRatingChange,
	size = 20,
	className,
}: StarRatingProps) {
	return (
		<div className={cn("flex gap-1", className)}>
			{Array.from({ length: maxRating }).map((_, i) => {
				const starValue = i + 1;
				const isFilled = starValue <= rating;

				return (
					<Star
						key={i}
						size={size}
						className={cn(
							"transition-colors",
							isFilled
								? "fill-yellow-400 text-yellow-400"
								: "fill-gray-100 text-gray-300",
							onRatingChange
								? "cursor-pointer hover:scale-110"
								: "cursor-default",
						)}
						onClick={() => onRatingChange && onRatingChange(starValue)}
					/>
				);
			})}
		</div>
	);
}
