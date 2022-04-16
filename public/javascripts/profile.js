document.querySelector(".menu").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("menuItem")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    e.target.classList.add("blueBg");
  }
});

const fir = document.querySelector("#fir");
const sec = document.querySelector("#sec");

sec.addEventListener("click", () => {
  sec.classList.add("blueBg");
  fir.classList.remove("blueBg");
});

fir.addEventListener("click", () => {
  sec.classList.remove("blueBg");
  fir.classList.add("blueBg");
});
