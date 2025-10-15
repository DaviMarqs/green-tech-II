import * as userService from "./users.service.js";

export const updateController = async (req, res) => {
	const { id } = req.params;
	const userData = req.body;

	if (id !== req.user.id) {
		return res.status(403).json({
			message: "Acesso negado. Você só pode alterar seus próprios dados.",
		});
	}

	try {
		const update = await userService.updateUser(id, userData);
		res.status(200).json(update);
	} catch (error) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const deactivateController = async (req, res) => {
	const { id } = req.params;

	if (id !== req.user.id) {
		return res.status(403).json({ message: "Acesso negado" });
	}

	try {
		await userService.deactivateUser(id);
		res.status(204).send(); //Sucesso, mas sem conteudo no body
	} catch (error) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
