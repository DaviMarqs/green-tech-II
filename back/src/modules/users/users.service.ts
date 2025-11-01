import type { UpdateUserDTO, UserResponse } from "./users.types";
import { Usuario } from "../../entities/user/users.entity";
import { AppError } from "../../errors/AppError";
import { AppDataSource } from "../../database/data-source";

const userRepository = AppDataSource.getRepository(Usuario);

export const updateUser = async (
  id: number,
  userData: UpdateUserDTO
): Promise<UserResponse> => {
  const userToUpdate = {};
  // const userToUpdate = await userRepository.findOne({
  //   where: {
  //     id: id,
  //     disabled_at: IsNull(),
  //   },
  // });

  if (!userToUpdate) {
    throw new AppError("Usuário não encontrado ou desativado.", 404);
  }

  // 2. Verificar se há dados para atualizar
  const { nome, telefone, cep } = userData;
  if (!nome && !telefone && !cep) {
    throw new AppError("Nenhum campo fornecido para atualização.", 400);
  }

  // 3. Mesclar os dados novos (userData) na entidade existente (userToUpdate)
  // O merge é inteligente e só atualiza os campos definidos em userData
  userRepository.merge(userToUpdate as any, userData);

  // 4. Salvar o usuário atualizado no banco
  const savedUser = await userRepository.save(userToUpdate);

  // 5. Construir a resposta segura (sem senha ou dados sensíveis)
  // Conforme a interface UserResponse
  const response: any = {};
  // const response: UserResponse = {
  //   id_usuario: savedUser.id, // Mapeia o 'id' da entidade para 'id_usuario' da resposta
  //   nome: savedUser.nome,
  //   email: savedUser.email,
  //   telefone: savedUser.telefone,
  //   cep: savedUser.cep,
  // };

  return response;
};

export const deactivateUser = async (
  id: number
): Promise<{ message: string }> => {
  // 1. Usamos o .update() para uma operação mais direta e eficiente
  // Apenas atualiza usuários que batem com o 'id' E que não estão desativados
  const result: any = [];
  // const result = await userRepository.update(
  //   {
  //     id: id,
  //     disabled_at: IsNull(),
  //   },
  //   {
  //     disabled_at: new Date(),
  //   }
  // );

  if (result.affected === 0) {
    throw new AppError("Usuário não encontrado ou já desativado.", 404);
  }

  return { message: "Usuário desativado com sucesso." };
};
