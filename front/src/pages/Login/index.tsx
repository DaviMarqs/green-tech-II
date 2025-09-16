import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  return (
    <section className="flex w-screen justify-between items-center">
      <div className="flex w-1/2 h-screen">
        <img
          className="w-full h-full object-cover"
          src="/icon-login.svg"
          alt="icon-login"
        />
      </div>
      <div className="content gap-2 flex w-1/2 flex-col">
        <div className="flex flex-col gap-6 w-3/5 m-auto">
          <div className="flex-col w-fit">
            <h2 className="font-[Dm Sans] text-3xl weight-medium pt-16 justify-between">
              Bem vindo(a) de volta!
            </h2>
            <div className="flex justify-between">
              <p className="flex w-full justify-between pt-2">
                Não possui uma conta?
                <a className="ml-auto text-[#00C06B]" href="">
                  Registre-se
                </a>
              </p>
            </div>
          </div>
          <div className="campo pt-3">
            <Label htmlFor="email" name="email" className="mb-2">
              Email
            </Label>
            <Input
              className="flex center rounded-md border border-gray-300 w-full bg-white"
              type="email"
              placeholder="user@gmail.com"
            />
          </div>
          <div className="flex-col w-full">
            <Label htmlFor="password" name="password" className="mb-2">
              Senha
            </Label>
            <Input
              className="flex center rounded-md border border-gray-300 w-full bg-white"
              type="password"
              placeholder="*****"
            />
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="lembrarSenha" className="w-4 h-4" />
              <Label htmlFor="lembrarSenha">Manter conectado</Label>
            </div>
            <a className="text-[#00C06B]" href="#">
              Esqueci a senha
            </a>
          </div>
          <div className="fazerLogin">
            <button className="text-1xl bg-[#00C06B] text-white px-8 py-2 rounded-2xl w-full">
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
