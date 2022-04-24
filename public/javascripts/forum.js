const layers = document.querySelectorAll(".layer");
const links = document.querySelectorAll(".link");

links.forEach((link) => {
  const layer = link.previousSibling;
  layer.addEventListener("mouseover", () => {
    link.style.color = "white";
    link.classList.remove("linkBg");
    layer.style.opacity = 1;
  });
  layer.addEventListener("mouseout", () => {
    link.style.color = "black";
    link.classList.add("linkBg");
    layer.style.opacity = 0;
  });
  link.addEventListener("mouseover", () => {
    link.style.color = "white";
    link.classList.remove("linkBg");

    layer.style.opacity = 1;
  });
  link.addEventListener("mouseout", () => {
    link.style.color = "black";
    layer.style.opacity = 0;
  });
});

// layers.forEach((layer) => {
//   links.forEach((link) => {
//     layer.addEventListener("mouseover", () => {
//       layer.style.opacity = 1;
//       if (layer.dataset.id == link.dataset.id) {
//         link.style.color = "white";
//       }
//     });
//     layer.addEventListener("mouseout", () => {
//       layer.style.opacity = 0;
//       if (layer.dataset.id == link.dataset.id) {
//         link.style.color = "black";
//       }
//     });
//     link.addEventListener("mouseover", () => {
//       link.style.color = "white";
//       link.previousSibling.style.opacity = 1;
//     });
//   });
// });
