import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CartSummary from "../CartSummary";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function TopBar() {
	const { items } = useCart();
	const [search, setSearch] = useState("");
	const { user } = useAuth();

	return (
		<div className="flex justify-between items-center px-8 py-4 border-b bg-white w-full">
			<div className="flex items-center gap-3 w-[50%]">
				<Input
					placeholder="🔍 Pesquisar..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full rounded-lg"
						/>
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="text-gray-700 border-gray-300">
					Ordenar por ▾
				</Button>
				</PopoverTrigger>

		<PopoverContent
			align="start"
			sideOffset={8}
			className="w-[130px] p-0 border border-gray-200 shadow-lg rounded-lg"
		>
			<div className="flex flex-col">
				<button
					onClick={() => console.log("Ordenar por relevância")}
					className="px-3 py-2 text-left hover:bg-gray-100"
				>
					Relevância
				</button>

				<button
					onClick={() => console.log("Ordenar por maior preço")}
					className="px-3 py-2 text-left hover:bg-gray-100"
				>
					Maior preço
				</button>

				<button
					onClick={() => console.log("Ordenar por menor preço")}
					className="px-3 py-2 text-left hover:bg-gray-100"
				>
					Menor preço
				</button>
			</div>
		</PopoverContent>
	</Popover>

				<Button variant="outline" className="text-gray-700 border-gray-300">
					Filtrar ⚙️
				</Button>
			</div>

			<div className="flex items-center gap-6">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link to={user ? "/my-profile" : "/"} className="outline-none">
							<div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
								<User className="size-5 text-gray-700 cursor-pointer" />
							</div>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="bottom" align="center">
						{user ? `Olá, ${user.nome}` : "Faça login"}
					</TooltipContent>
				</Tooltip>

				<Popover>
					<PopoverTrigger asChild>
						<button className="relative p-1 rounded-full hover:bg-gray-100 transition-colors">
							<ShoppingCart className="size-5 text-gray-700 cursor-pointer" />
							{items.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-1.5 rounded-full">
									{items.length}
								</span>
							)}
						</button>
					</PopoverTrigger>

					<PopoverContent
						align="end"
						sideOffset={8}
						className="w-[320px] p-0 border border-gray-200 shadow-lg rounded-xl"
					>
						<CartSummary />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
