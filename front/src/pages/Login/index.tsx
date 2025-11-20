import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: "all",
	});

	const handleLogin = async (data: LoginFormValues) => {
		setLoading(true);
		try {
			const response = await api.post("/auth/login", {
				email: data.email,
				senha: data.password,
			});

			login(response.data.user, response.data.token);
			toast.success(`Bem-vindo, ${response.data.user.nome}!`, {
				duration: 3000,
			});
			navigate("/dashboard");
		} catch (error: any) {
			console.error(error);
			const errorMessage =
				error.response?.data?.message || "Verifique suas credenciais.";
			toast.error("Erro ao fazer login", {
				description: errorMessage,
				duration: 4000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex w-screen justify-between items-center overflow-x-hidden">
			<div className="w-1/2 h-screen hidden sm:flex">
				<img
					className="w-full h-full object-cover"
					src="/icon-login.svg"
					alt="icon-login"
				/>
			</div>

			<div className="content gap-2 flex w-full flex-col h-screen sm:w-1/2 justify-center items-center overflow-y-auto">
				<div className="flex flex-col gap-6 w-full max-w-md p-6 m-auto">
					<div className="flex-col w-fit mx-auto text-center">
						<h2 className="font-[Dm Sans] text-3xl font-semibold mb-2">
							Bem-vindo(a) de volta!
						</h2>
						<div className="flex justify-center">
							<p className="flex text-gray-600">
								Não possui uma conta?
								<Link
									to="/register"
									className="ml-2 text-[#00C06B] underline font-medium"
								>
									Registre-se
								</Link>
							</p>
						</div>
					</div>

					<form
						onSubmit={handleSubmit(handleLogin)}
						className="flex flex-col gap-5"
					>
						<div className="space-y-1">
							<Label
								htmlFor="email"
								className={errors.email ? "text-red-500" : ""}
							>
								Email
							</Label>
							<Input
								id="email"
								className={`rounded-md border w-full bg-white ${
									errors.email
										? "border-red-500 focus-visible:ring-red-500"
										: "border-gray-300"
								}`}
								type="email"
								placeholder="user@gmail.com"
								{...register("email")}
							/>
							{errors.email && (
								<span className="text-xs text-red-500 font-medium">
									{errors.email.message}
								</span>
							)}
						</div>

						<div className="space-y-1">
							<Label
								htmlFor="password"
								className={errors.password ? "text-red-500" : ""}
							>
								Senha
							</Label>
							<Input
								id="password"
								className={`rounded-md border w-full bg-white ${
									errors.password
										? "border-red-500 focus-visible:ring-red-500"
										: "border-gray-300"
								}`}
								type="password"
								placeholder="*****"
								{...register("password")}
							/>
							{errors.password && (
								<span className="text-xs text-red-500 font-medium">
									{errors.password.message}
								</span>
							)}
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Checkbox
									id="lembrarSenha"
									className="w-4 h-4 cursor-pointer border-gray-400"
								/>
								<Label
									htmlFor="lembrarSenha"
									className="cursor-pointer text-gray-600"
								>
									Manter conectado
								</Label>
							</div>
							<Link
								to="/forgot"
								className="text-[#00C06B] underline text-sm font-medium"
							>
								Esqueci a senha
							</Link>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="bg-[#00C06B] text-white py-6 rounded-xl text-lg hover:bg-green-700 transition w-full"
						>
							{loading ? "Entrando..." : "Fazer login"}
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}
