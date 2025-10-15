import * as authService from "./auth.service.js";

export const registerController = async (req, res, next) => {
	try {
		const { nome, cpf, email, senha, telefone, cep, data_nasc } = req.body;

		if (!nome || !email || !senha || !cpf) {
			return res.status(400).json({ message: "Dados obrigatórios ausentes." });
		}

		const newUser = await authService.register({
			nome,
			cpf,
			email,
			senha,
			telefone,
			cep,
			data_nasc,
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
