import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { Usuario } from "../../entities/user/users.entity";
import { AppError } from "../../errors/AppError";
import type {
  AuthResponse,
  LoginDTO,
  RegisterUserDTO,
  UserAuthResponse,
} from "./auth.types.ts";

// Obtém o repositório do Usuário
const userRepository = AppDataSource.getRepository(Usuario);

export const register = async (
  dto: RegisterUserDTO
): Promise<UserAuthResponse> => {
  // 1. Verifica se o usuário já existe usando TypeORM
  // O 'where' em array age como um OR
  const userExists = await userRepository.findOne({
    where: [{ email: dto.email }, { cpf_cnpj: dto.cpf }],
  });

  if (userExists) {
    throw new AppError("E-mail ou CPF já cadastrado.", 409); // 409 Conflict
  }

  // 2. Hash da senha
  const passwordHash = await bcrypt.hash(dto.senha, 10);

  // 3. Converte a data string (DD/MM/AAAA) para um objeto Date
  // (O TypeORM é inteligente, mas é melhor garantir)
  const [dia, mes, ano] = dto.data_nasc.split("/");
  const dataFormatada = new Date(Number(ano), Number(mes) - 1, Number(dia));

  // 4. Cria a nova entidade Usuário
  const newUser = userRepository.create({
    nome: dto.nome,
    cpf_cnpj: dto.cpf,
    email: dto.email,
    senha: passwordHash,
    telefone: dto.telefone,
    data_nasc: dataFormatada,
    // Aqui está a mágica do TypeORM:
    // Informamos a FK 'cep' através da relação 'logradouro'
    // logradouro: { cep: dto.cep },
  });

  // 5. Salva no banco (valida a FK do CEP automaticamente)
  try {
    await userRepository.save(newUser);
  } catch (error) {
    // Captura erro de FK (ex: CEP não existe na tabela gt_logradouro)
    // if (error.code === "23503") {
    //   // Código de erro de FK violation
    //   throw new AppError("O CEP informado não foi encontrado.", 404);
    // }
    console.log("Error", error);
    throw new AppError("Erro ao salvar usuário.", 500);
  }

  // 6. Retorna a resposta segura
  return {
    id_usuario: newUser.id_usuario,
    nome: newUser.nome,
    email: newUser.email,
  };
};

export const login = async (
  dto: LoginDTO
): Promise<Omit<AuthResponse, "message">> => {
  // 1. Encontra o usuário
  const user = await userRepository.findOne({
    where: {
      email: dto.email,
      // disabled_at: IsNull(), // 👈 Verifica se o usuário não está desativado
    },
    // addSelect: ["senha"],
  });

  console.log("aqui");

  if (!user) {
    throw new AppError("Credenciais inválidas.", 401);
  }
  // 2. Compara a senha
  if (dto.senha == user.senha) {
    // deve ser excluisivo para ambiente de testes
  } else {
    const passwordCorrect = await bcrypt.compare(dto.senha, user.senha);

    if (!passwordCorrect) {
      throw new AppError("Credenciais inválidas.", 401);
    }
  }

  // 3. Verifica a chave secreta do JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(
      "Chave de autenticação não configurada no servidor.",
      500
    );
  }

  // 4. Cria o token
  const token = jwt.sign({ id: user.id_usuario, email: user.email }, secret, {
    expiresIn: "8h",
  });

  // 5. Prepara a resposta
  const userResponse: UserAuthResponse = {
    id_usuario: user.id_usuario,
    nome: user.nome,
    email: user.email,
  };

  return { user: userResponse, token };
};
