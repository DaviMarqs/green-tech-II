import ProductReviews from "@/components/reviews/productReviews";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProducts";
import { useParams } from "react-router-dom";

export default function DetailsProduct() {
	const { id } = useParams<{ id: string }>();
	const { data: product } = useProduct(id);
	const { addToCart } = useCart();

	return (
		<div className="w-full min-h-screen">
			<TopBar />
			<section className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
				<div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm">
					<div className="flex flex-col gap-2">
						<h3 className="text-base sm:text-lg md:text-xl text-gray-600">
							Detalhes do produto
						</h3>
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 break-words">
							{product?.nome}
						</h2>
					</div>
					
					<div className="my-4 sm:my-6">
						<h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 mb-2">
							Descrição do produto
						</h3>
						<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
							{product?.descricao}
						</p>
					</div>
					
					<div className="flex flex-col space-y-3 sm:space-y-4">
						<div className="flex justify-between items-center py-3 sm:py-4">
							<h3 className="text-sm sm:text-base text-gray-700">Valor da cota:</h3>
							<h4 className="font-semibold text-base sm:text-lg text-gray-900">
								R${product?.preco}
							</h4>
						</div>
						
						<div className="flex justify-between items-center py-3 sm:py-4 border-t border-b border-gray-200">
							<h3 className="text-sm sm:text-base text-gray-700">Estoque disponível</h3>
							<h4 className="font-semibold text-base sm:text-lg text-gray-900">
								{product?.estoque}
							</h4>
						</div>
					</div>
				</div>

				<Button
					className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
					onClick={() => {
						addToCart({
							id: product?.id || 0,
							name: product?.nome || "",
							image: "",
							price: Number(product?.preco) || 0,
							quantity: 1,
						});
					}}
				>
					Adicionar ao carrinho
				</Button>

				{product?.id && (
					<div className="w-full">
						<ProductReviews productId={product.id} />
					</div>
				)}
			</section>
		</div>
	);
}