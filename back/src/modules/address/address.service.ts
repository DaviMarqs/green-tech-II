import { QueryFailedError, type DataSource, type EntityManager } from "typeorm";
import { Estado } from "../../entities/address/estado.entity";
import { Cidade } from "../../entities/address/cidade.entity";
import { Bairro } from "../../entities/address/bairro.entity";
import { Logradouro } from "../../entities/address/logradouro.entity";
import { Endereco } from "../../entities/address/endereco.entity";
import { AppDataSource } from "../../database/data-source";
import type { RegisterEnderecoDTO } from "./address.types";
import { AppError } from "../../errors/AppError";

const findOrCreateEstado = async (
	data: { nome: string; sigla: string },
	manager: EntityManager,
): Promise<Estado> => {
	let estado = await manager.findOne(Estado, {
		where: { sigla: data.sigla.toUpperCase() },
	});
	if (!estado) {
		estado = manager.create(Estado, {
			nome: data.nome,
			sigla: data.sigla.toUpperCase(),
		});
		await manager.save(estado);
	}
	return estado;
};
// ... (findOrCreateCidade, findOrCreateBairro, findOrCreateLogradouro) ...
const findOrCreateCidade = async (
	data: { nome: string },
	estado: Estado,
	manager: EntityManager,
): Promise<Cidade> => {
	let cidade = await manager.findOne(Cidade, {
		where: {
			nome_cidade: data.nome,
			id_estado: { id: estado.id },
		},
		relations: ["id_estado"],
	});
	if (!cidade) {
		cidade = manager.create(Cidade, {
			nome_cidade: data.nome,
			id_estado: estado,
		});
		await manager.save(cidade);
	}
	return cidade;
};

const findOrCreateBairro = async (
	data: { nome: string },
	cidade: Cidade,
	manager: EntityManager,
): Promise<Bairro> => {
	let bairro = await manager.findOne(Bairro, {
		where: {
			nome_bairro: data.nome,
			id_cidade: { id_cidade: cidade.id_cidade },
		},
		relations: ["id_cidade"],
	});
	if (!bairro) {
		bairro = manager.create(Bairro, {
			nome_bairro: data.nome,
			id_cidade: cidade,
		});
		await manager.save(bairro);
	}
	return bairro;
};

const findOrCreateLogradouro = async (
	data: { cep: string; logradouro: string },
	bairro: Bairro,
	manager: EntityManager,
): Promise<Logradouro> => {
	let logradouro = await manager.findOne(Logradouro, {
		where: { cep: data.cep },
	});
	if (!logradouro) {
		logradouro = manager.create(Logradouro, {
			cep: data.cep,
			logradouro: data.logradouro,
			id_bairro: bairro,
		});
		await manager.save(logradouro);
	}
	return logradouro;
};
// --- Função Principal Exportada ---

export const createCompleto = async (
	body: RegisterEnderecoDTO,
): Promise<Endereco> => {
	const dataSource = AppDataSource;

	return dataSource.transaction(
		async (manager: EntityManager): Promise<Endereco> => {
			try {
				// ... (lógica de findOrCreate... idêntica) ...
				// 1. Estado
				const estado = await findOrCreateEstado(body.estado, manager);
				// 2. Cidade
				const cidade = await findOrCreateCidade(body.cidade, estado, manager);
				// 3. Bairro
				const bairro = await findOrCreateBairro(body.bairro, cidade, manager);
				// 4. Logradouro
				const logradouro = await findOrCreateLogradouro(
					body.logradouro,
					bairro,
					manager,
				);
				// 5. Endereço (Create)
				const novoEndereco = manager.create(Endereco, {
					numero: body.numero,
					complemento: body.complemento,
					cep: logradouro,
				});

				await manager.save(novoEndereco);
				return novoEndereco;
			} catch (error) {
				// 1. Verifica se o erro é uma instância de QueryFailedError
				if (error instanceof QueryFailedError) {
					// 2. Verifica se 'driverError' existe, se é um objeto, e
					//    se a propriedade 'code' existe dentro dele (Type Guard)
					if (
						error.driverError &&
						typeof error.driverError === "object" &&
						"code" in error.driverError &&
						typeof error.driverError.code === "string"
					) {
						const driverErrorCode = error.driverError.code;

						// O código '23503' é para PostgreSQL (Foreign Key Violation)
						if (driverErrorCode === "23503") {
							throw new AppError(
								"O CEP informado não foi encontrado ou outro dado de referência é inválido.",
								404,
							);
						}

						// O código '23505' é para PostgreSQL (Unique Violation)
						if (driverErrorCode === "23505") {
							throw new AppError(
								"Um dos dados informados (como CEP) já existe e viola uma regra de unicidade.",
								409, // 409 Conflict
							);
						}
					}
				}

				// 3. Se for um AppError (que nós mesmos lançamos), apenas o relance
				if (error instanceof AppError) {
					throw error;
				}

				// 4. Para todos os outros erros desconhecidos
				console.error("Erro na transação de endereço:", error);
				throw new AppError("Erro interno ao salvar o endereço.", 500);
			}
		},
	);
};
