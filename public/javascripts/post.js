// last comment no border bottom
// const posts = document.querySelectorAll(".post");
// posts[posts.length - 1].style.borderBottom = "none";

const scrolls = document.querySelectorAll(".commentScroll");
const writeC = document.querySelector(".writeComment");

scrolls.forEach((scroll) => {
  scroll.addEventListener("click", function () {
    writeC.scrollIntoView({ behavior: "smooth" });
  });
});

const replyBtns = document.querySelectorAll(".replyBtn");
const replySecs = document.querySelectorAll(".writeReply");
// console.log(replySecs);

replyBtns.forEach((btn) => {
  // console.log(btn.dataset.id);
  replySecs.forEach((ele) => {
    btn.addEventListener("click", () => {
      if (ele.id === btn.dataset.id) {
        console.log(true);
        ele.classList.toggle("hidden");
      }
    });
  });
});

const comments = document.querySelectorAll(".comment");
const count = document.querySelector("#count");
count.insertAdjacentHTML("afterbegin", `${comments.length} `);

const likes = document.querySelectorAll(".like");
likes.forEach((like) => {
  like.addEventListener("click", () => {
    console.log("clicked");
    like.children[0].classList.toggle("hidden");
    like.children[1].classList.toggle("hidden");
  });
});
