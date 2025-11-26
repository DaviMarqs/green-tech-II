import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import {
	normalizeCpfCnpj,
	normalizeDate,
	normalizePhone,
	isValidDate,
} from "@/lib/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";



const registerSchema = z
	.object({
		nome: z
			.string()
			.min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
			.regex(/^[^0-9]*$/, { message: "Nome não pode conter números" }),
		email: z.string().email({ message: "E-mail inválido" }),
		password: z
			.string()
			.min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
		confirmPassword: z.string(),
		cpfCnpj: z.string().min(11, { message: "CPF/CNPJ inválido" }),
		phoneNumber: z.string().min(10, { message: "Telefone inválido" }),
		dataNasc: z
			.string()
			.min(10, { message: "Data incompleta" })
			.refine(isValidDate, { message: "Data inexistente ou inválida" }),
		// ADICIONE ESTA LINHA AQUI ↓
		aceitarTermos: z.boolean().refine((val) => val === true, {
			message: "Você precisa aceitar os termos de uso",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch, // ADICIONE ESTA LINHA
		formState: { errors, isValid }, // ADICIONE isValid AQUI
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		mode: "all",
		// ADICIONE ESTE BLOCO ↓
		defaultValues: {
			aceitarTermos: false,
		},
	});

	const aceitarTermos = watch("aceitarTermos");

	const handleRegister = async (data: RegisterFormValues) => {
		setLoading(true);
		try {
			await api.post("/auth/register", {
				nome: data.nome,
				email: data.email,
				senha: data.password,
				cpf: data.cpfCnpj,
				telefone: data.phoneNumber,
				data_nasc: data.dataNasc,
			});

			toast.success("Cadastro feito com sucesso!", { duration: 4000 });
			navigate("/");
		} catch (error: any) {
			console.error(error);
			const msg = error.response?.data?.message || "Erro ao fazer cadastro!";
			toast.error(msg, { duration: 4000 });
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex w-screen justify-between items-center overflow-x-hidden">
			<div className="w-1/2 h-screen hidden lg:block">
				<img
					className="w-full h-full object-cover"
					src="/foto-register.svg"
					alt="register-img"
				/>
			</div>
			<div className="content flex flex-col h-screen w-full lg:w-1/2 overflow-y-auto">
				<div className="flex flex-col gap-3 p-6 m-auto max-w-lg w-full">
					<div className="flex-col w-fit mx-auto mb-4">
						<h2 className="font-[Dm Sans] text-3xl w-full text-center font-semibold justify-between">
							Crie uma conta
							<span className="ml-2 text-[#00C06B]">GreenTech</span>
						</h2>
						<div className="flex justify-center">
							<p className="flex pt-2 text-gray-600">
								Já possui uma conta?
								<Link
									to="/"
									className="ml-2 text-[#00C06B] underline font-medium"
								>
									Faça login
								</Link>
							</p>
						</div>
					</div>

					<form
						onSubmit={handleSubmit(handleRegister)}
						className="flex flex-col gap-4"
					>
						<div className="space-y-1">
							<Label
								htmlFor="nome"
								className={errors.nome ? "text-red-500" : ""}
							>
								Nome completo
							</Label>
							<Input
								id="nome"
								className={`bg-white ${errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}`}
								placeholder="Seu nome"
								{...register("nome", {
									onChange: (e) => {
										const value = e.target.value.replace(/\d/g, "");
										setValue("nome", value);
									},
								})}
							/>
							{errors.nome && (
								<span className="text-xs text-red-500 font-medium">
									{errors.nome.message}
								</span>
							)}
						</div>

						<div className="space-y-1">
							<Label
								htmlFor="email"
								className={errors.email ? "text-red-500" : ""}
							>
								Email
							</Label>
							<Input
								id="email"
								className={`bg-white ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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

						<div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
							<div className="w-full space-y-1">
								<Label
									htmlFor="password"
									className={errors.password ? "text-red-500" : ""}
								>
									Senha
								</Label>
								<Input
									id="password"
									className={`bg-white ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
							<div className="w-full space-y-1">
								<Label
									htmlFor="confirmPassword"
									className={errors.confirmPassword ? "text-red-500" : ""}
								>
									Confirmar senha
								</Label>
								<Input
									id="confirmPassword"
									className={`bg-white ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									type="password"
									placeholder="*****"
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && (
									<span className="text-xs text-red-500 font-medium">
										{errors.confirmPassword.message}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-1">
							<Label
								htmlFor="cpfCnpj"
								className={errors.cpfCnpj ? "text-red-500" : ""}
							>
								CPF / CNPJ
							</Label>
							<Input
								id="cpfCnpj"
								className={`bg-white ${errors.cpfCnpj ? "border-red-500 focus-visible:ring-red-500" : ""}`}
								placeholder="000.000.000-00"
								maxLength={18}
								{...register("cpfCnpj", {
									onChange: (e) => {
										setValue("cpfCnpj", normalizeCpfCnpj(e.target.value));
									},
								})}
							/>
							{errors.cpfCnpj && (
								<span className="text-xs text-red-500 font-medium">
									{errors.cpfCnpj.message}
								</span>
							)}
						</div>

						<div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
							<div className="w-full space-y-1">
								<Label
									htmlFor="phoneNumber"
									className={errors.phoneNumber ? "text-red-500" : ""}
								>
									Número de telefone
								</Label>
								<Input
									id="phoneNumber"
									className={`bg-white ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									placeholder="(00) 00000-0000"
									maxLength={15}
									{...register("phoneNumber", {
										onChange: (e) => {
											setValue("phoneNumber", normalizePhone(e.target.value));
										},
									})}
								/>
								{errors.phoneNumber && (
									<span className="text-xs text-red-500 font-medium">
										{errors.phoneNumber.message}
									</span>
								)}
							</div>
							<div className="w-full space-y-1">
								<Label
									htmlFor="dataNasc"
									className={errors.dataNasc ? "text-red-500" : ""}
								>
									Data de Nasc.
								</Label>
								<Input
									id="dataNasc"
									className={`bg-white ${errors.dataNasc ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									placeholder="DD/MM/AAAA"
									maxLength={10}
									{...register("dataNasc", {
										onChange: (e) => {
											setValue("dataNasc", normalizeDate(e.target.value));
										},
									})}
								/>
								{errors.dataNasc && (
									<span className="text-xs text-red-500 font-medium">
										{errors.dataNasc.message}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center gap-2 my-2">
								<Checkbox
									id="aceitarTermos"
									checked={aceitarTermos}
									onCheckedChange={(checked) => {
										setValue("aceitarTermos", checked === true, {
											shouldValidate: true,
										});
									}}
									className={`w-4 h-4 cursor-pointer ${errors.aceitarTermos ? "border-red-500" : "border-gray-400"}`}
								/>
								<Label
									htmlFor="aceitarTermos"
									className={`text-sm font-normal cursor-pointer ${errors.aceitarTermos ? "text-red-500" : "text-gray-600"}`}
								>
									Concordo com os{" "}
									<span className="text-[#00C06B] underline">Termos de Uso</span>
								</Label>
							</div>
							{errors.aceitarTermos && (
								<span className="text-xs text-red-500 font-medium">
									{errors.aceitarTermos.message}
								</span>
							)}
						</div>

						<div className="pt-2">
							<button
								type="submit"
								disabled={loading || !isValid}
								className="text-base font-medium bg-[#00C06B] hover:bg-green-700 transition text-white px-8 py-3 rounded-xl w-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{loading ? "Cadastrando..." : "Fazer cadastro"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}