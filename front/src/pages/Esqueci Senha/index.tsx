import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Esqueci() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const response = await api.post("/auth/login", {
        email,
        senha: password,
      });
      console.log("Login bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <section className="flex w-screen justify-between items-center ">
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
              Recuperar senha
            </h2>
          </div>
          <div className="pt-3">
            <Label htmlFor="email" className="mb-2" id="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
              type="email"
              placeholder="user@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex-col w-full">
            <div className="flex justify-between gap-5">
                <div className="w-full">
                    <Label htmlFor="password" className="mb-2">
                    Nova senha
                    </Label>
                        <Input
                        className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
                        type="password"
                        placeholder="*****"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        />
                </div>
                <div className="w-full">
                    <Label htmlFor="confirmPassword" className="mb-2">
                    Confirme a senha
                    </Label>
                        <Input
                        className="flex center rounded-md border border-gray-300 w-full bg-white text-sm lg:text-base"
                        type="password"
                        placeholder="*****"
                        id="confirmPassword"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        />
                </div>
            </div>
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
            </div>
          </div>
          <div className="flex-col gap-2">
            <button
              className="text-1xl bg-[#00C06B] text-white px-8 py-2 rounded-2xl w-full hover:cursor-pointer mb-5"
              onClick={handleLogin}
            >
              Alterar senha
            </button>
            <Link
            to="/"
              className="text-1xl bg-zinc-100 border-1 border-zinc-200 text-black px-8 py-2 rounded-2xl w-full hover:cursor-pointer block text-center"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}