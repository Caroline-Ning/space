"use strict";

// learn more -> scroll to top section
const learnBtn = document.querySelector(".learnMore");
const topSec = document.querySelector(".top");

learnBtn.addEventListener("click", function () {
  topSec.scrollIntoView({ behavior: "smooth" });
});

// 1.2.3.4 -> type 1234
const cataContent = document.querySelector(".cataContent");

cataContent.addEventListener("click", (e) => {
  if (!e.target.closest(".type")) return;

  const clickedType = e.target.closest(".type");
  const typeNum = clickedType.dataset.type;
  console.log(typeNum);

  const toEle = document.querySelector(`#type${typeNum}`);
  toEle.scrollIntoView({ behavior: "smooth" });
});

// sticky nav appears when not intersecting header
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;

const obCallback = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) {
    console.log("should add fixed");
    nav.classList.add("fixed");
  } else nav.classList.remove("fixed");
};

const obOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight + 19}px`,
};

const obs = new IntersectionObserver(obCallback, obOption);

obs.observe(header);

const slider = function () {
  //-------------- dots
  const slides = document.querySelectorAll(".slide");

  const dotContainer = document.querySelector(".dots");

  // slide > dotContainer <button></>
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}">`
      );
    });
  };

  // click dot / btn -> active
  const activateDot = function (curSlide) {
    // remove all
    document.querySelectorAll(".dots__dot").forEach((ele) => {
      ele.classList.remove("dots__dot--active");
    });

    // add on (based on number)
    document
      .querySelector(`.dots__dot[data-slide='${curSlide}']`)
      .classList.add("dots__dot--active");
  };

  // click -> go to slide
  dotContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      placeSlides(e.target.dataset.slide);

      // click -> active
      activateDot(e.target.dataset.slide);
    }
  });

  //---------------------------- slider --------------------------------

  // temporaray
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  let curSlide = 0;
  const xMax = slides.length;

  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");

  const placeSlides = function (para) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - para) * 100}%)`;
    });
  };

  const nextSlide = function () {
    curSlide++;
    if (curSlide == xMax) curSlide = 0;

    placeSlides(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide == 0) curSlide = xMax;
    curSlide--;
    placeSlides(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    placeSlides(0);
    createDots();
    activateDot(0);
  };

  init();

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // press <- ->
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};

slider();
