import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const bodyGradient = {
  backgroundImage: `
    radial-gradient(ellipse farthest-corner at -10% 5%, rgba(234, 237, 245, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse farthest-corner at 110% 40%, rgba(234, 237, 245, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse farthest-corner at 15% 105%, rgba(234, 237, 245, 0.6) 0%, transparent 45%),
    radial-gradient(ellipse farthest-corner at 90% -15%, rgba(234, 237, 245, 0.6) 0%, transparent 55%),
    radial-gradient(ellipse farthest-corner at 0% 50%, rgba(234, 237, 245, 0.6) 0%, transparent 60%)
  `,
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#ffffff'
};

const heroTextShadow = {
  textShadow: '0 154px 43px rgba(0, 0, 0, 0.00), 0 99px 39px rgba(0, 0, 0, 0.01), 0 56px 33px rgba(0, 0, 0, 0.05), 0 25px 25px rgba(0, 0, 0, 0.09), 0 6px 14px rgba(0, 0, 0, 0.10)'
};

interface Step {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
  reverse: boolean;
}

interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const steps: Step[] = [
  { id: 1, icon: "/public/1.svg", title: "Faça o cadastro na plataforma", description: "Crie sua conta como comprador ou vendedor com seus dados básicos." },
  { id: 2, icon: "/public/2.svg", title: "Compre ou anuncie energia solar", description: "Busque cotas para economizar ou anuncie sua energia excedente em minutos." },
  { id: 3, icon: "/public/3.svg", title: "Acompanhe tudo em tempo real", description: "Receba pagamentos, acompanhe relatórios e consulte avaliações em um só lugar." }
];

const features: Feature[] = [
  { id: 1, title: "Economize com energia solar, sem instalar placas", description: "Conecte-se a produtores de energia solar em nossa plataforma e reduza o gasto na sua conta de luz.", image: "/public/detalhe-1.jpg", reverse: false },
  { id: 2, title: "Gerencie seu consumo de energia", description: "Acompanhe em tempo real seu uso de créditos, seus gastos e o total que você está economizando a cada mês em nosso dashboard.", image: "/public/detalhe-2.jpg", reverse: true },
  { id: 3, title: "Relatórios de economia e impacto", description: "Acesse relatórios que comprovam sua economia e mostram o impacto ambiental positivo de usar uma energia limpa e renovável.", image: "/public/detalhe-3.jpg", reverse: false }
];

const benefits: Benefit[] = [
  { id: 1, icon: "/public/icon-busca.svg", title: "Busca Simplificada", description: "Encontre produtores e cotas de energia solar perto de você." },
  { id: 2, icon: "/public/icon-economia.svg", title: "Economia Real", description: "Reduza até 95% da sua conta de luz sem precisar instalar painéis." },
  { id: 3, icon: "/public/icon-energia.svg", title: "Energia Limpa e Acessível", description: "Use energia solar de forma simples, prática e sustentável." },
  { id: 4, icon: "/public/icon-anuncio.svg", title: "Anúncio Rápido", description: "Cadastre e gerencie seus produtos (cotas de energia) em minutos." },
  { id: 5, icon: "/public/icon-excedente.svg", title: "Venda Seu Excedente", description: "Rentabilize sua produção de energia sem burocracia." },
  { id: 6, icon: "/public/icon-notafiscal.svg", title: "Pagamento Direto", description: "Receba em uma carteira digital exclusiva e saque quando quiser." },
];

const testimonials: Testimonial[] = [
  { id: 1, name: "Felipe Kenzo", role: "Designer de Interfaces", text: "Conheci o GreenTech através de um amigo que me recomendou a plataforma, já economizei muito utilizando o sistema!", image: "/public/user_profile.png" },
  { id: 2, name: "Yuri Chryst", role: "Product Owner", text: "Comecei a usar o GreenTech sem muitas expectativas, mas logo percebi a diferença na minha conta de energia.", image: "/public/foto-yuri.jpg" },
  { id: 3, name: "Felipe Silva", role: "Front-End Developer", text: "Achei incrível poder comprar energia de forma prática e transparente. Estou muito satisfeito com os resultados até agora.", image: "/public/foto-felipe.jpg" },
  { id: 4, name: "Giovanna Jurgensen", role: "Software QA Analyst", text: "A qualidade da plataforma e a facilidade de uso me surpreenderam. Tudo funciona perfeitamente e sem burocracia.", image: "/public/foto-giovanna.jpg" },
  { id: 5, name: "Danillo Monteiro", role: "Software Developer", text: "Nunca pensei que teria tanto controle sobre meu consumo de energia. O dashboard da GreenTech realmente entrega muito valor.", image: "/public/foto-danillo.jpg" },
  { id: 6, name: "Davi Marques", role: "Software Engineer", text: "Além da economia, gostei muito da experiência dentro da plataforma. Tudo bem organizado e o suporte é excelente.", image: "/public/foto-davi.jpg" },
];

const faqs: FaqItem[] = [
  { id: 1, question: "Eu não tenho placas solares. Posso usar a GreenTech?", answer: "Sim, com certeza! A GreenTech foi criada especialmente para você. Nossa plataforma permite que você compre créditos de energia solar de quem produz em excesso e use esses créditos para obter um desconto direto na sua conta de luz, sem precisar de nenhuma instalação." },
  { id: 2, question: "Qualquer pessoa pode vender na GreenTech?", answer: "Na GreenTech, você terá flexibilidade para definir o preço das suas cotas de energia, dentro de parâmetros que garantam um mercado justo e competitivo. Nossa plataforma pode oferecer sugestões baseadas na oferta e demanda, mas a decisão final é sua." },
  { id: 3, question: "Como isso funciona na prática? A energia solar chega direto na minha casa?", answer: "A energia não chega fisicamente à sua casa, mas o benefício sim. Ao comprar uma 'cota de energia', você adquire créditos energéticos. Esses créditos são injetados na rede elétrica da sua distribuidora local e, de acordo com a legislação (Lei nº 14.300), são usados para abater o seu consumo. O resultado prático é uma redução significativa no valor da sua fatura." },
  { id: 4, question: "Quanto eu posso realmente economizar na minha conta de luz por mês?", answer: "A economia pode variar dependendo do seu consumo e das ofertas disponíveis no nosso marketplace. No entanto, o modelo de energia por assinatura, como o da GreenTech, foi projetado para garantir que você sempre pague um valor menor do que pagaria à sua distribuidora tradicional." },
  { id: 5, question: "Como eu sei de quem estou comprando? Os vendedores são confiáveis?", answer: "A confiança é nossa prioridade. Todos os vendedores passam por um processo de cadastro e verificação. Além disso, nossa plataforma conta com um sistema de avaliações onde você pode ver o feedback de outros compradores sobre cada vendedor antes de tomar sua decisão." },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const scrollLeft = () => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div style={bodyGradient} className="min-h-screen font-['DM_Sans'] text-[#343638] overflow-x-hidden selection:bg-green-200">
      
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4 
        ${isScrolled ? 'bg-white/85 shadow-lg backdrop-blur-md' : 'bg-white shadow-[0_552px_155px_0_rgba(0,0,0,0),0_353px_141px_0_rgba(0,0,0,0.01),0_199px_119px_0_rgba(0,0,0,0.03),0_88px_88px_0_rgba(0,0,0,0.04),0_22px_49px_0_rgba(0,0,0,0.05)]'}`}
      >
        <div className="container mx-auto flex items-center justify-between max-w-340">
          <img src="/public/logo-green.svg" alt="Logo da GreenTech" className="h-8 md:h-10 w-auto" />

          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-8">
              <li><a href="#sobre" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">Sobre nós</a></li>
              <li><a href="#s-steps" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">Como funciona</a></li>
              <li><a href="#s-features" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">Plataforma</a></li>
              <li><a href="#s-beneficios" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">Benefícios</a></li>
              <li><a href="#s-depoimentos" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">Depoimentos</a></li>
              <li><a href="#s-faq" className="text-[#343638] font-medium text-lg hover:text-green-600 transition-colors">FAQ</a></li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-4 login-area">
             <a href="/login">
               <Button className=" font-semibold text-lg px-6 py-2 bg-transparent border-none cursor-pointer text-[#343638] hover:bg-white transition-colors">Fazer login</Button>
             </a>
             <a href="/register">
               <Button className="bg-green-600 text-[#052e16] font-semibold text-lg px-6 py-2 rounded-full hover:bg-green-700 transition-colors">Cadastrar-se</Button>
             </a>
          </div>

          <img 
            src="/public/icon-hamburger.svg" 
            alt="Menu" 
            className="lg:hidden w-8 cursor-pointer z-1000"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>

        <div 
          className={`fixed top-0 right-0 w-[260px] h-screen bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.2)] p-6 z-999 flex flex-col transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-end mb-6">
             <X className="w-8 h-8 cursor-pointer text-green-600" onClick={() => setIsMenuOpen(false)} />
          </div>

          <nav className="flex flex-col gap-4">
             {['Sobre nós', 'Como funciona', 'Plataforma', 'Benefícios', 'Depoimentos', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item === 'Sobre nós' ? 'sobre' : 's-' + item.toLowerCase().split(' ')[0]}`}
                  onClick={() => setIsMenuOpen(false)} 
                  className="block p-4 rounded-lg text-lg font-semibold text-[#052e16] bg-green-50 border-2 border-green-500 hover:bg-green-500 hover:text-white transition-all"
                >
                  {item}
                </a>
             ))}
             <div className="mt-4 flex flex-col gap-3">
               <a href="/" className="w-full text-center p-3 rounded-lg border-2 border-gray-200 font-semibold">Login</a>
               <a href="/register" className="w-full text-center p-3 rounded-lg bg-green-600 text-[#052e16] font-semibold">Cadastrar</a>
             </div>
          </nav>
        </div>
      </header>

      <main className="mt-20">
        
        <section className="mx-4 md:mx-6 lg:mx-6 mt-24 md:mt-6 rounded-4xl md:rounded-[3rem] bg-[url('/public/background.jpg')] bg-cover bg-center flex justify-center items-center py-32 md:py-40 lg:py-56 relative overflow-hidden">
          <div className="container px-4 text-center z-10">
            <h1 style={heroTextShadow} className="text-white text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold leading-tight tracking-tight lg:tracking-[-0.09rem] max-w-212 mx-auto">
              Sua conta de luz mais barata com energia solar
            </h1>
            <p style={heroTextShadow} className="text-white text-[0.8rem] md:text-[1.5rem] lg:text-[1.75rem] font-normal max-w-160 mx-auto mt-4">
              A GreenTech une quem produz energia limpa a quem quer reduzir a conta de luz. Simples assim.
            </p>
            
            <a href="/dashboard" className="inline-flex items-center gap-2 md:gap-4 bg-white rounded-full px-4 py-2 md:px-3 md:py-2 mt-8 md:mt-6 cursor-pointer hover:scale-105 transition-transform">
              <p className="text-[#343638] text-sm md:text-xl font-semibold m-0">Quero conhecer a <span className="text-green-600">plataforma</span></p>
              <img src="/public/icone-arrow.svg" alt="Seta" className="w-6 md:w-auto" />
            </a>
          </div>
        </section>

        <section id="sobre" className="py-16 md:py-24 px-4 container mx-auto max-w-340">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            <div className="w-full lg:flex-1">
               <img src="/public/foto-sobre.png" alt="Sobre nós" className="w-full h-auto max-w-[500px] mx-auto lg:max-w-full" />
            </div>
            <div className="w-full lg:flex-1 text-center lg:text-left">
               <h1 className="text-[#343638] text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] font-semibold leading-tight mb-4">
                 <strong className="text-green-600">Revolucionamos</strong> o jeito de usar <strong>energia solar</strong>
               </h1>
               <div className="space-y-4 text-[#343638] text-[1rem] md:text-[1.5rem] lg:text-[1.25rem] font-normal max-w-[42.5rem] mx-auto lg:mx-0">
                 <p>A GreenTech é um marketplace onde produtores de energia solar e compradores se encontram para fazer negócio de um jeito fácil e vantajoso.</p>
                 <p>Conectamos quem tem energia solar sobrando com quem quer usar essa energia para economizar na conta de luz.</p>
                 <p>Sem complicação, sem quebra-quebra: não precisa instalar nada se você for comprar.</p>
               </div>
            </div>
          </div>
        </section>
    
        <section id="s-steps" className="pb-16 md:pb-20 px-4">
          <div className="container mx-auto max-w-340">
            <div className="text-center mb-8">
              <h1 className="text-[#343638] text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-semibold">Como funciona?</h1>
              <h5 className="text-[#343638] text-[1.25rem] md:text-[1.5rem] font-normal mt-2">3 passos simples para economizar ou lucrar com energia solar</h5>
            </div>
            
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 mt-8">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-4 max-w-md p-8 rounded-3xl border-[0.5px] border-[#E5E5E5] bg-white mx-auto md:mx-0">
                  <img src={step.icon} alt={step.title} className="w-16 h-16 object-contain" />
                  <h4 className="text-[#343638] text-[1.5rem] font-semibold">
                    {step.id === 1 && <>Faça o <strong className="text-green-600">cadastro</strong> na plataforma</>}
                    {step.id === 2 && <>Compre ou anuncie <strong className="text-green-600">energia solar</strong></>}
                    {step.id === 3 && <>Acompanhe tudo em <strong className="text-green-600">tempo real</strong></>}
                  </h4>
                  <p className="text-[#343638] text-[1.125rem] font-normal grow">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="s-features" className="overflow-x-hidden py-12 md:py-16">
          <div className="container mx-auto max-w-340 px-4 md:px-8">
             <div className="text-center mb-8 px-4 md:px-8">
                <h1 className="text-[#343638] text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] font-semibold">
                  Cada <strong className="text-[#009E4F]">detalhe</strong> pensado em você
                </h1>
                <h2 className="text-[#343638] text-[1rem] md:text-[1.5rem] font-normal mt-2">Interfaces intuitivas que tornam complexo em simples.</h2>
             </div>

             <div className="flex flex-col gap-8 md:gap-0">
               {features.map((feature) => (
                 <div key={feature.id} className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-8 md:py-16 px-4 md:px-8`}>
                   <div className="w-full lg:flex-1">
                      <img src={feature.image} alt={feature.title} className="w-full h-auto rounded-3xl border border-gray-300/50 shadow-sm" />
                   </div>
                   <div className="w-full lg:flex-1 text-center lg:text-left">
                      <h3 className="text-[#292929] text-[1.5rem] md:text-[2rem] font-bold mb-4">{feature.title}</h3>
                      <p className="text-[#292929] text-[1rem] md:text-[1.25rem] font-normal">{feature.description}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        <section id="s-beneficios" className="py-12 px-4 md:px-8">
           <div className="container mx-auto max-w-340">
              <div className="text-center mb-8">
                 <h1 className="text-[#343638] text-[2.25rem] md:text-[3.5rem] font-semibold max-w-150 mx-auto pb-4">
                   Quais os benefícios da <strong className="text-green-600">GreenTech</strong> para você?
                 </h1>
                 <p className="text-[#343638] text-[1.25rem] md:text-[1.5rem] font-normal">Seja vendedor ou comprador, a GreenTech é para você</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-8">
                 {benefits.map((benefit) => (
                   <div key={benefit.id} className="flex flex-col items-start gap-2 p-6 rounded-3xl border-[0.5px] border-[#E5E5E5] bg-white hover:shadow-lg transition-shadow">
                      <img src={benefit.icon} alt={benefit.title} className="w-12 h-12 mb-2" />
                      <h5 className="text-[#343638] text-[1.5rem] font-semibold">{benefit.title}</h5>
                      <p className="text-[#343638] text-[1rem] font-normal">{benefit.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <section id="s-depoimentos" className="pt-16 pb-20 px-4">
           <div className="container mx-auto max-w-340">
              <div className="flex flex-col lg:flex-row items-end justify-between mb-8 text-center lg:text-left gap-4 lg:gap-0 pt-16">
                 <div className="flex flex-col gap-2 mx-auto lg:mx-0">
                    <h1 className="text-[#343638] text-[2.5rem] lg:text-[3.5rem] font-semibold leading-tight">Inteligente, econômico, simples.</h1>
                    <h2 className="text-[#343638] opacity-50 text-[1.5rem] font-medium">Sua conta de luz sob controle, sem burocracia.</h2>
                 </div>
              </div>

              <div className="relative group">
                 <button 
                   onClick={scrollLeft} 
                   className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full text-green-600 border border-gray-100 hover:bg-green-50 transition-all -ml-4"
                 >
                    <ChevronLeft size={24} />
                 </button>

                 <div 
                   ref={testimonialRef}
                   className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                 >
                    {testimonials.map((t) => (
                      <div 
                        key={t.id} 
                        className="snap-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-8 rounded-3xl border border-[#E5E5E5] bg-white flex flex-col justify-between min-h-[14rem] md:min-h-[16.5rem]"
                      >
                         <div>
                           <div className="flex gap-1 mb-2">
                              {[1,2,3,4,5].map(i => <img key={i} src="/public/icon-estrela.svg" alt="Star" className="w-6 h-6" />)}
                           </div>
                           <p className="text-[#2F2A2A] text-[1.125rem] font-normal pt-2">{t.text}</p>
                         </div>
                         <div className="flex items-center gap-4 pt-4">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                               <h5 className="text-[#2F2A2A] text-[1.125rem] font-bold">{t.name}</h5>
                               <h6 className="text-[#302A2A] opacity-60 text-[1rem] font-normal">{t.role}</h6>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <button 
                   onClick={scrollRight} 
                   className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full text-green-600 border border-gray-100 hover:bg-green-50 transition-all -mr-4"
                 >
                    <ChevronRight size={24} />
                 </button>
              </div>
           </div>
        </section>

        <section id="s-faq" className="pt-16 pb-12 px-4">
            <div className="container mx-auto max-w-255">
               <h1 className="text-[#343638] text-[2rem] md:text-[2.5rem] font-semibold text-center mb-8">Perguntas Frequentes</h1>
               
               <div className="flex flex-col gap-8">
                  {faqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className={`w-full p-6 md:p-8 transition-all duration-400 ease-in-out border-b border-gray-200/50 
                        ${openFaq === faq.id ? 'rounded-2xl bg-gradient-to-r from-[#fdfdff] to-[#f7f9fc] border-b-0' : 'rounded-none'}`}
                    >
                       <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFaq(faq.id)}>
                          <h3 className="text-[#343638] text-[1.25rem] md:text-[1.5rem] font-semibold">{faq.question}</h3>
                          <img 
                            src="/public/icon-faq.svg" 
                            alt="Toggle" 
                            className={`transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} 
                          />
                       </div>
                       <div className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === faq.id ? 'max-h-[31.25rem] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0'}`}>
                          <p className="text-[#343638] text-[1rem] md:text-[1.125rem] leading-[166%] font-normal">
                            {faq.answer}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
        </section>

      </main>

      <footer className="bg-[#14532d] w-full mt-20 px-4 py-0">
         <div className="container mx-auto max-w-340">
            <div className="flex flex-col md:flex-row items-center justify-between py-10 border-b border-white/10 mb-10 gap-8 md:gap-0">
               <img src="/public/logo-white.svg" alt="GreenTech White" />
               
               <div className="flex items-center gap-6">
                  <span className="text-white text-sm font-normal font-['DM_Sans'] text-right hidden md:block">Acompanhe nas redes</span>
                  <div className="flex gap-4 md:gap-6">
                     <a href="#"><img src="/public/icon-yt.svg" alt="YouTube" /></a>
                     <a href="#"><img src="/public/icon-linked.svg" alt="LinkedIn" /></a>
                     <a href="#"><img src="/public/icon-facebook.svg" alt="Facebook" /></a>
                     <a href="#"><img src="/public/icon-instagram.svg" alt="Instagram" /></a>
                     <a href="#"><img src="/public/icon-twitter.svg" alt="Twitter" /></a>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 md:gap-18 pb-14 border-b border-white/10">
               <div className="flex flex-col gap-8 text-center md:text-left">
                  <h4 className="text-white text-base font-semibold">GreenTech</h4>
                  <ul className="flex flex-col gap-4 md:gap-8">
                     {['Quem somos', 'Como funciona?', 'Benefícios', 'Perguntas frequentes', 'Depoimentos'].map(item => (
                       <li key={item} className="text-white text-sm font-normal opacity-65 font-['DM_Sans'] hover:opacity-100 cursor-pointer">{item}</li>
                     ))}
                  </ul>
               </div>

               <div className="flex flex-col gap-8 text-center md:text-left">
                  <h4 className="text-white text-base font-semibold">Integrantes</h4>
                  <ul className="flex flex-col gap-4 md:gap-8">
                     {['Danillo Monteiro', 'Davi Marques', 'Felipe Kenzo', 'Felipe Silva', 'Giovanna Jurgensen', 'Yuri Chryst'].map(item => (
                       <li key={item} className="text-white text-sm font-normal opacity-65 font-['DM_Sans'] hover:opacity-100">{item}</li>
                     ))}
                  </ul>
               </div>

               <div className="mt-4 md:mt-0 w-full md:w-auto">
                  <div className="flex flex-col md:flex-row items-center gap-4 p-8 rounded-md bg-white/5 mx-auto md:mx-0 max-w-sm md:max-w-none">
                     <img src="/public/icon-atendimento.svg" alt="Email" className="w-6 h-6 shrink-0" />
                     <div className="text-center md:text-left">
                        <span className="block text-white text-sm font-semibold mb-1 font-['DM_Sans']">Atendimento:</span>
                        <p className="text-white text-sm font-normal opacity-65">ajuda@greentech.com.br</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="py-8 text-center">
              <p className="text-white/40 text-sm">© 2024 GreenTech. Todos os direitos reservados.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}