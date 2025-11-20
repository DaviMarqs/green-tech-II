import type { UpdateUserDTO, UserResponse } from "./users.types";
import { Usuario } from "../../entities/user/users.entity";
import { AppError } from "../../errors/AppError";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../database/data-source";

const userRepository = AppDataSource.getRepository(Usuario);

// Buscar dados para o Perfil
export const getUserProfile = async (id: number): Promise<UserResponse> => {
	const user = await userRepository.findOne({
		where: { id_usuario: id },
	});

	if (!user) {
		throw new AppError("Usuário não encontrado.", 404);
	}

	return {
		id_usuario: user.id_usuario,
		nome: user.nome,
		email: user.email,
		telefone: user.telefone,
		cep: user.cep,
		// ✅ AGORA RETORNA OS DADOS QUE FALTAVAM
		cpfCnpj: user.cpfCnpj,
		data_nasc: user.data_nasc,
		numero: user.numero,
	};
};

// Atualizar dados
export const updateUser = async (
	id: number,
	userData: UpdateUserDTO,
): Promise<UserResponse> => {
	const userToUpdate = await userRepository.findOne({
		where: { id_usuario: id },
	});

	if (!userToUpdate) {
		throw new AppError("Usuário não encontrado.", 404);
	}

	// Validação de E-mail duplicado
	if (userData.email && userData.email !== userToUpdate.email) {
		const emailExists = await userRepository.findOne({
			where: { email: userData.email },
		});
		if (emailExists) {
			throw new AppError("Este e-mail já está em uso.", 409);
		}
	}

	// Criptografar senha
	if (userData.senha) {
		const hashedPassword = await bcrypt.hash(userData.senha, 10);
		userToUpdate.senha = hashedPassword;
	}

	// ✅ ATUALIZAÇÃO DOS CAMPOS
	if (userData.nome) userToUpdate.nome = userData.nome;
	if (userData.telefone) userToUpdate.telefone = userData.telefone;
	if (userData.cep) userToUpdate.cep = userData.cep;
	if (userData.email) userToUpdate.email = userData.email;

	// Campos novos
	if (userData.numero) userToUpdate.numero = userData.numero;
	if (userData.data_nasc) {
		// Garante que venha como Date
		userToUpdate.data_nasc = new Date(userData.data_nasc);
	}

	try {
		const savedUser = await userRepository.save(userToUpdate);

		return {
			id_usuario: savedUser.id_usuario,
			nome: savedUser.nome,
			email: savedUser.email,
			telefone: savedUser.telefone,
			cep: savedUser.cep,
			cpfCnpj: savedUser.cpfCnpj,
			data_nasc: savedUser.data_nasc,
			numero: savedUser.numero,
		};
	} catch (error) {
		console.error(error);
		throw new AppError("Erro ao atualizar dados. Verifique os campos.", 500);
	}
};

export const deactivateUser = async (
	id: number,
): Promise<{ message: string }> => {
	const result = await userRepository.delete(id);
	if (result.affected === 0) {
		throw new AppError("Usuário não encontrado.", 404);
	}
	return { message: "Usuário removido com sucesso." };
};

export const resetPassword = async (email: string, senha: string) => {
	const user = await userRepository.findOne({ where: { email } });
	if (!user) {
		throw new AppError("Usuário não encontrado.", 404);
	}
	const passwordHash = await bcrypt.hash(senha, 10);
	user.senha = passwordHash;
	await userRepository.save(user);
	return { message: "Senha redefinida." };
};
