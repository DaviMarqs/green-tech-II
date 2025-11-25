import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Search, SlidersHorizontal } from "lucide-react";
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
		<div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center px-3 sm:px-6 md:px-8 py-3 sm:py-4 border-b bg-white w-full">
			{/* Seção de busca e filtros */}
			<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-[70%] md:w-[60%] lg:w-[50%]">
				{/* Input de busca */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
					<Input
						placeholder="Pesquisar..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full rounded-lg pl-10 text-sm sm:text-base"
					/>
				</div>

				{/* Botões de ordenar e filtrar - Desktop */}
				<div className="hidden md:flex items-center gap-2">
					<Button 
						variant="outline" 
						className="text-gray-700 border-gray-300 text-sm whitespace-nowrap"
					>
						Ordenar por ▾
					</Button>

				</div>

			</div>

			{/* Seção de ícones de usuário e carrinho */}
			<div className="flex items-center justify-end gap-4 sm:gap-6">
				{/* Ícone de usuário */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Link to={user ? "/my-profile" : "/"} className="outline-none">
							<div className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors">
								<User className="size-5 sm:size-6 text-gray-700 cursor-pointer" />
							</div>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="bottom" align="center">
						{user ? `Olá, ${user.nome}` : "Faça login"}
					</TooltipContent>
				</Tooltip>

				{/* Ícone de carrinho com badge */}
				<Popover>
					<PopoverTrigger asChild>
						<button className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors">
							<ShoppingCart className="size-5 sm:size-6 text-gray-700 cursor-pointer" />
							{items.length > 0 && (
								<span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] flex items-center justify-center">
									{items.length}
								</span>
							)}
						</button>
					</PopoverTrigger>

					<PopoverContent
						align="end"
						sideOffset={8}
						className="w-[calc(100vw-2rem)] max-w-[320px] sm:w-[320px] p-0 border border-gray-200 shadow-lg rounded-xl"
					>
						<CartSummary />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}