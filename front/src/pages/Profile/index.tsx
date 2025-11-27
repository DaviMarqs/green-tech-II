import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  MapPin,
  Pencil,
  Save,
  X,
  Loader2,
  Info,
  Lock,
  Calendar as CalendarIcon,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { api } from "@/services/api";

const profileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  cpfCnpj: z.string().optional(),
  data_nasc: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

const passwordSchema = z
  .object({
    novaSenha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [hasAddress, setHasAddress] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass, isSubmitting: isSavingPass },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!user) return;

    async function loadUserAndAddress() {
      try {
        if (!user) return;
        const { data } = await api.get(`/address/user/${user.id_usuario}`);
        console.log("user data:", user);

        const addr = data && data.length > 0 ? data[0] : null;

        reset({
          // 🔹 Dados do usuário
          nome: user.nome || "",
          email: user.email || "",
          telefone: user.telefone || "",
          cpfCnpj: user.cpf_cnpj || "",
          data_nasc: user.data_nasc || "",

          // 🔹 Endereço (se existir)
          rua: addr?.logradouro || "",
          numero: addr?.numero?.toString() || "",
          bairro: addr?.bairro || "",
          cep: addr?.cep || "",
          estado: addr?.estado?.nome_estado || "",
          cidade: addr?.cidade?.nome_cidade || "",
        });

        if (addr) {
          setHasAddress(true);
        } else {
          setHasAddress(false);
          setIsEditing(true); // libera edição pra cadastrar endereço
        }
      } catch (error) {
        console.log("Usuário sem endereço ainda.");
        setHasAddress(false);
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserAndAddress();
  }, [user, reset]);

  // 3. Salvar Alterações
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id_usuario) return;
    setIsSaving(true);

    try {
      // 1) Atualiza dados básicos do usuário
      const updatedUser = await userService.updateProfile(user.id_usuario, {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        // se seu backend precisar, pode mandar cep/numero aqui também
        // cep: data.cep,
        // numero: data.numero,
      });

      // 2) Monta o payload de endereço
      const addressPayload = {
        cep: data.cep,
        logradouro: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        // se o backend espera id_usuario no body:
        id_usuario: user.id_usuario,
      };

      // 3) Cria ou atualiza endereço
      // if (hasAddress) {
      //   // ajuste o nome do método conforme seu service
      //   await addressService.updateAddress(user.id_usuario, addressPayload);
      //   // ou, se usar id_endereco:
      //   // await addressService.updateAddress(addressId, addressPayload);
      // } else {
      //   await addressService.createAddress(addressPayload);
      //   setHasAddress(true);
      // }

      // 4) Atualiza contexto de auth
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        login(
          {
            ...user,
            nome: updatedUser.nome,
            email: updatedUser.email,
          },
          currentToken
        );
      }

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar", {
        description: error.message || "Verifique os dados e tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Alterar Senha
  const onChangePassword = async (data: PasswordFormValues) => {
    if (!user?.id_usuario) return;

    try {
      await userService.updateProfile(user.id_usuario, {
        senha: data.novaSenha,
      });

      toast.success("Senha alterada com sucesso!");
      setPasswordModalOpen(false);
      resetPass();
    } catch {
      toast.error("Erro ao alterar senha");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-50/30">
      <div className="w-[1280px]">
        <TopBar />

        <main className="p-8 space-y-8 w-3/4 mx-auto mb-20">
          <div className="flex items-end justify-between border-b pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Perfil do Usuário
              </h1>
              <p className="text-gray-500">
                Gerencie suas informações pessoais e de contato
              </p>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="gap-2"
                    disabled={isSaving}
                  >
                    <X className="size-4" /> Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 shadow-sm bg-white hover:bg-gray-50"
                >
                  <Pencil className="size-4 text-green-600" /> Editar Perfil
                </Button>
              )}
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: Informações Pessoais */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="size-5 text-green-700" />
                  </div>
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-gray-600 flex items-center gap-2">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("nome")}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-50/50"
                    />
                    <User className="size-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.nome && (
                    <span className="text-xs text-red-500">
                      {errors.nome.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-600">E-mail</Label>
                  <div className="relative">
                    <Input
                      {...register("email")}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-50/50"
                    />
                    <Mail className="size-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-600">Data de Nascimento</Label>
                    <div className="relative">
                      {/* ✅ MUDANÇA AQUI: type="text" e placeholder */}
                      <Input
                        type="text"
                        {...register("data_nasc")}
                        disabled={true}
                        placeholder="dd/mm/aaaa"
                        className="pl-10 bg-gray-100 cursor-not-allowed"
                      />
                      <CalendarIcon className="size-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-600">CPF/CNPJ</Label>
                    <div className="relative">
                      <Input
                        {...register("cpfCnpj")}
                        disabled={true}
                        className="pl-10 bg-gray-100 cursor-not-allowed"
                      />
                      <FileText className="size-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-600">Telefone</Label>
                  <div className="relative">
                    <Input
                      {...register("telefone")}
                      disabled={!isEditing}
                      placeholder="(00) 00000-0000"
                      className="pl-10 bg-gray-50/50"
                    />
                    <Phone className="size-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.telefone && (
                    <span className="text-xs text-red-500">
                      {errors.telefone.message}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t mt-4">
                  <Dialog
                    open={passwordModalOpen}
                    onOpenChange={setPasswordModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-normal"
                      >
                        <Lock className="size-4 mr-2" /> Deseja alterar sua
                        senha?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>
                          Insira sua nova senha abaixo.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        id="pass-form"
                        onSubmit={handleSubmitPass(onChangePassword)}
                        className="space-y-4 py-2"
                      >
                        <div className="space-y-2">
                          <Label>Nova Senha</Label>
                          <Input
                            type="password"
                            {...registerPass("novaSenha")}
                          />
                          {errorsPass.novaSenha && (
                            <span className="text-xs text-red-500">
                              {errorsPass.novaSenha.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Confirmar Nova Senha</Label>
                          <Input
                            type="password"
                            {...registerPass("confirmarSenha")}
                          />
                          {errorsPass.confirmarSenha && (
                            <span className="text-xs text-red-500">
                              {errorsPass.confirmarSenha.message}
                            </span>
                          )}
                        </div>
                      </form>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setPasswordModalOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          form="pass-form"
                          disabled={isSavingPass}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSavingPass ? "Salvando..." : "Confirmar Alteração"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Endereço */}
            <Card className="border-none shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="size-5 text-blue-700" />
                  </div>
                  Endereço Completo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-gray-600">Rua</Label>
                    <Input
                      {...register("rua")}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                      placeholder={hasAddress ? "" : "Digite o logradouro"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-600">Número</Label>
                    <Input
                      {...register("numero")}
                      disabled={!isEditing}
                      placeholder="Nº"
                      className="bg-gray-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-600">Bairro</Label>
                  <Input
                    {...register("bairro")}
                    disabled={!isEditing}
                    className="bg-gray-50/50"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-gray-600">Cidade</Label>
                    <Input
                      {...register("cidade")}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-600">UF</Label>
                    <Input
                      {...register("estado")}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-600">CEP</Label>
                  <Input
                    {...register("cep")}
                    disabled={!isEditing}
                    className="bg-gray-50/50"
                    maxLength={9}
                  />

                  {errors.cep && (
                    <span className="text-xs text-red-500">
                      {errors.cep.message}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-green-700 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 text-sm">
                Plataforma de Marketplace de Energia Solar
              </h4>
              <p className="text-green-700 text-sm mt-1 leading-relaxed">
                Seus dados são protegidos e utilizados apenas para melhorar sua
                experiência na plataforma GreenTech.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
