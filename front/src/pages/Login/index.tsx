import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        email,
        senha: password,
      });

      login(data.user, data.token);

      toast.success(`Bem-vindo, ${data.user.nome}!`, { duration: 3000 });

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao fazer login", {
        description:
          error.response?.data?.message || "Verifique suas credenciais.",
        duration: 4000,
      });
    }
  };

  return (
    <section className="flex w-screen justify-between items-center">
      <div className="w-1/2 h-screen hidden sm:flex">
        <img
          className="w-full h-full object-cover"
          src="/icon-login.svg"
          alt="icon-login"
        />
      </div>

      <div className="content gap-2 flex w-full flex-col h-screen sm:w-1/2">
        <div className="flex flex-col gap-6 w-auto lg:w-3/5 m-auto">
          <div className="flex-col w-fit">
            <h2 className="font-[Dm Sans] text-3xl text-center font-semibold justify-between">
              Bem-vindo(a) de volta!
            </h2>
            <div className="flex justify-between">
              <p className="flex w-full pt-2">
                Não possui uma conta?
                <Link to="/register" className="ml-2 text-[#00C06B] underline">
                  Registre-se
                </Link>
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                className="rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
                type="email"
                placeholder="user@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                className="rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
                type="password"
                placeholder="*****"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lembrarSenha"
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="lembrarSenha" className="cursor-pointer">
                  Manter conectado
                </Label>
              </div>
              <Link to="/forgot" className="text-[#00C06B] underline text-sm">
                Esqueci a senha
              </Link>
            </div>

            <Button
              type="submit"
              className="bg-[#00C06B] text-white py-2 rounded-xl text-lg hover:bg-green-700 transition"
            >
              Fazer login
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
