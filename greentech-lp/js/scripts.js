document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".slide-depositions", {
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
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

  const perguntas = document.querySelectorAll(".s-faq .pergunta");

  perguntas.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
      const estaAtivo = pergunta.classList.contains("active");

      perguntas.forEach((item) => {
        item.classList.remove("active");
        item.querySelector("p").style.maxHeight = null;
      });

      if (!estaAtivo) {
        pergunta.classList.add("active");
        const resposta = pergunta.querySelector("p");

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
