import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";


export function Register() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [cpfCnpj, setCpfCnpj] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [dataNasc, setDataNasc] = useState("");
	const handleRegister = async (event: React.FormEvent) => {
		try {
			event.preventDefault();
			const response = await api.post("/auth/register", {
				nome,
				email,
				senha: password,
				cpf: cpfCnpj,
				telefone: phoneNumber,
				data_nasc: dataNasc,
			});
                toast.success("Cadastro feito com sucesso!", {
                    duration: 4000,
                });
			window.location.assign("/");
		} catch (error) {
                toast.error("Erro ao fazer cadastro!", {
                    duration: 4000,
                }); return;
		}
	};

	return (
		<section className="flex w-screen justify-between items-center">
			<div className="w-1/2 h-screen hidden lg:block">
				<img
					className="w-full h-full object-cover"
					src="/foto-register.svg"
					alt="icon-login"
				/>
			</div>
			<div className="content flex flex-col h-screen w-full lg:w-1/2">
				<div className="flex flex-col gap-3 p-6 m-auto">
					<div className="flex-col w-fit">
						<h2 className="font-[Dm Sans] text-3xl w-full text-center font-semibold justify-between">
							Crie uma conta
							<span className="ml-2 text-[#00C06B]">GreenTech</span>
						</h2>
						<div className="flex">
							<p className="flex w-full pt-2">
								Já possui uma conta?
								<Link
									to="/"
									className="ml-auto sm:ml-2 text-[#00C06B] underline"
								>
									Faça login
								</Link>
							</p>
						</div>
					</div>
					<div className="pt-3">
						<Label htmlFor="email" className="mb-2">
							Nome completo
						</Label>
						<Input
							className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
							type="text"
							placeholder="Seu nome"
							onChange={(e) => setNome(e.target.value)}
							value={nome}
						/>
					</div>
					<div className="pt-3">
						<Label htmlFor="email" className="mb-2">
							Email
						</Label>
						<Input
							className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
							type="email"
							placeholder="user@gmail.com"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div className="flex gap-3 lg:gap-7">
						<div className="flex-col w-full">
							<Label htmlFor="password" className="mb-2">
								Senha
							</Label>
							<Input
								className="flex center rounded-md border border-gray-300 w-full bg-white"
								type="password"
								placeholder="*****"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
						</div>
						<div className="flex-col w-full">
							<Label htmlFor="password" className="mb-2">
								Confirmar senha
							</Label>
							<Input
								className="flex center rounded-md border border-gray-300 w-full bg-white"
								type="password"
								placeholder="*****"
								onChange={(e) => setConfirmPassword(e.target.value)}
								value={confirmPassword}
							/>
						</div>
					</div>
					<p className="text-neutral-700 text-sm">
						A senha deve ter no mínimo 8 caracteres
					</p>
					<div className="pt-3">
						<Label htmlFor="CPF" className="mb-2">
							CPF / CNPJ
						</Label>
						<Input
							className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
							type="string"
							placeholder="000.000.000-00"
							onChange={(e) => setCpfCnpj(e.target.value)}
							value={cpfCnpj}
						/>
					</div>
					<div className="flex gap-3 lg:gap-7">
						<div className="pt-3 w-1/2">
							<Label htmlFor="email" className="mb-2">
								Número de telefone
							</Label>
							<Input
								className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
								type="string"
								placeholder="(00) 00000-0000"
								onChange={(e) => setPhoneNumber(e.target.value)}
								value={phoneNumber}
							/>
						</div>
						<div className="pt-3 w-1/2">
							<Label htmlFor="email" className="mb-2">
								Data de Nasc.
							</Label>
							<Input
								className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
								type="string"
								placeholder="01/01/2000"
								onChange={(e) => setDataNasc(e.target.value)}
								value={dataNasc}
							/>
						</div>
					</div>
					<div className="flex gap-2 justify-between">
						<div className="flex items-center gap-2">
							<Checkbox
								id="lembrarSenha"
								className="w-4 h-4 hover:cursor-pointer"
							/>
							<Label
								htmlFor="lembrarSenha"
								className="text-sm lg:text-base hover:cursor-pointer"
							>
								Concordo com os{" "}
								<span className="text-[#00C06B] underline text-sm lg:text-base">
									Termos de Uso{" "}
								</span>
							</Label>
						</div>
					</div>
					<div className="Cadastro">
						<button
							type="submit"
							className="text-1xl bg-[#00C06B] text-white px-8 py-2 rounded-2xl w-full cursor-pointer"
							onClick={handleRegister}
						>
							Fazer cadastro
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
