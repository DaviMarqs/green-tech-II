document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".slide-depositions", {
    slidesPerView: 1,
    spaceBetween: 16,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });

  AOS.init({
    duration: 1000,
  });

  const perguntas = document.querySelectorAll(".s-faq .pergunta");

  perguntas.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
      const estaAtivo = pergunta.classList.contains("active");

      // Primeiro, fecha todas as perguntas para garantir que apenas uma esteja aberta
      perguntas.forEach((item) => {
        item.classList.remove("active");
        item.querySelector("p").style.maxHeight = null;
      });

      // Se a pergunta clicada não estava ativa, então a abre.
      if (!estaAtivo) {
        pergunta.classList.add("active");
        const resposta = pergunta.querySelector("p");
        // O problema provavelmente está no valor de `resposta.scrollHeight`.
        // Inspecione o CSS para este elemento <p> e verifique se há alguma regra
        // (como `height` ou `max-height`) limitando seu tamanho.

        resposta.style.maxHeight = resposta.scrollHeight + 10 + "px";
      }
    });
  });
});

const menuBtn = document.querySelector(".icon-responsivo");
const nav = document.querySelector("header nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const loginBtn = document.querySelector(".login");
loginBtn.addEventListener("click", () => {
  window.location.href = "http://localhost:5173";
});
