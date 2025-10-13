import * as authService from "./auth.service.js";

export const registerController = async (req, res, next) => {
	try {
		const { name, cpf, email, senha, telefone, cep } = req.body;

		if (!name || !email || !senha || !cpf) {
			return res.status(400).json({ message: "Dados obrigatórios ausentes." });
		}

		const newUser = await authService.register({
			name,
			cpf,
			email,
			senha,
			telefone,
			cep,
		});

		res.status(201).json({
			message: "Usuário criado com sucesso!",
			user: newUser,
		});
	} catch (err) {
		next(err);
	}
};

export const loginController = async (req, res, next) => {
	try {
		const { email, senha } = req.body;

		if (!email || !senha) {
			return res
				.status(400)
				.json({ message: "E-mail e senha são obrigatórios." });
		}

		// Chama a função 'login' diretamente do service importado
		const { user, token } = await authService.login({ email, senha });

		res.status(200).json({
			message: "Login bem-sucedido!",
			user,
			token,
		});
	} catch (err) {
		next(err);
	}
};
