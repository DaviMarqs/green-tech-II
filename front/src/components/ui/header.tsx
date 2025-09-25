import { Link } from "react-router-dom";
import { Button } from "./button";

function Header() {
  return (
    <header className="border-b border-[#F4F4F4]">
      <div className="container flex justify-between p-6 items-center">
        <Link to="/">
         <img src="./logo-header.svg" alt="Logo da GreenTech"/>
         </Link>  
        <nav>
          <ul className="hidden md:flex gap-6">
            <li><a href="#sobre">Sobre nós</a></li>
            <li><a href="#s-steps">Como funciona</a></li>
            <li><a href="#s-features">Plataforma</a></li>
            <li><a href="#s-beneficios">Benefícios</a></li>
            <li><a href="#s-depoimentos">Depoimentos</a></li>
            <li><a href="#s-faq">FAQ</a></li>
          </ul>
        </nav>
        <div className="login-area flex gap-3">
          <Link to="/">
            <Button className="bg-white text-[#00C06B] border border-[#00C06B] px-8 py-2 rounded-2xl hover:bg-[#F4F4F4] hover:text-[#00C06B] cursor-pointer">Fazer login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-[#00C06B] text-white px-8 py-2 rounded-2xl hover:bg-[#00a359] cursor-pointer">Cadastrar-se</Button>
          </Link>
        </div>
        <img src="/icon-hamburger.svg" alt="Icone - responsivo" className="md:hidden" />
      </div>
    </header>
  );
}

export default Header;
