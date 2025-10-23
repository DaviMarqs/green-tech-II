import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleLogin = async (event: React.FormEvent) => {
		try {
			event.preventDefault();
			const response = await api.post("/auth/login", {
				email,
				senha: password,
			});
                toast.success("Login realizado!", {
                    duration: 4000,
                });
			window.location.assign("/dashboard");
		} catch (error) {
                toast.error("Erro ao fazer login!", {
                    description: "Erro ao puxar dados",
                    duration: 4000,
                }); return;
		}
	};

	return (
		<section className="flex w-screen justify-between items-center ">
			<div className="w-1/2 h-screen hidden sm:flex">
				<img
					className="w-full h-full object-cover"
					src="/icon-login.svg"
					alt="icon-login"
				/>
			</div>
			<div className="content gap-2 flex w-full flex-col h-screen sm:w-1/2">
				<div className="flex flex-col gap-6 w-auto lg:w-3/5 m-auto">
					<div className="flex-col w-fit">
						<h2 className="font-[Dm Sans] text-3xl text-center font-semibold justify-between">
							Bem vindo(a) de volta!
						</h2>
						<div className="flex justify-between">
							<p className="flex w-full text-wrap:-nowrap pt-2">
								Não possui uma conta?
								<Link
									to="/register"
									className="ml-2 text-[#00C06B] text-wrap:-nowrap underline"
								>
									Registre-se
								</Link>
							</p>
						</div>
					</div>
					<div className="pt-3">
						<Label htmlFor="email" className="mb-2" id="email">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
							type="email"
							placeholder="user@gmail.com"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div className="flex-col w-full">
						<Label htmlFor="password" className="mb-2">
							Senha
						</Label>
						<Input
							className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
							type="password"
							placeholder="*****"
							id="password"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
					</div>
					<div className="flex gap-2 justify-between">
						<div className="flex items-center gap-2">
							<Checkbox
								id="lembrarSenha"
								className="w-4 h-4 hover:cursor-pointer"
							/>
							<Label htmlFor="lembrarSenha" className="hover:cursor-pointer">
								Manter conectado
							</Label>
						</div>
						<Link
							to="/forgot"
							className="ml-2 text-[#00C06B] text-wrap:-nowrap underline"
						>
							Esqueci a senha
						</Link>
					</div>
					<div className="fazerLogin">
						<button
							type="submit"
							className="text-1xl bg-[#00C06B] text-white px-8 py-2 rounded-2xl w-full hover:cursor-pointer"
							onClick={handleLogin}
						>
							Fazer login
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
