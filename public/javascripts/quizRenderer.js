const startBtn = document.querySelector(".start-btn"),
  nextBtn = document.querySelector(".next-btn"),
  subBtn = document.querySelector(".sub-btn"),
  questionElement = document.querySelector(".question"),
  answersContainer = document.querySelector(".q-container"),
  quizTitleElement = document.querySelector(".quiz-title"),
  correctCount = document.querySelector(".correct-count"),
  passingGrade = document.querySelector(".grade");
let currentQuestion = 0;
let correct = 0;

correctCount.innerHTML = `Score: ${correct * 10}/${questions.length * 10}`;

window.addEventListener("load", () => {
  quizTitleElement.innerHTML = quizData.title;
});

startBtn.addEventListener("click", () => {
  startQuiz();
});

nextBtn.addEventListener("click", () => {
  loadQuestion(currentQuestion);
});

function startQuiz() {
  correct = 0;
  currentQuestion = 0;
  correctCount.innerHTML = `Score: ${correct * 10}/${questions.length * 10}`;

  quizTitleElement.classList.add("hide");
  startBtn.classList.add("hide");
  passingGrade.classList.add("hide");
  subBtn.classList.add("hide");
  nextBtn.classList.remove("hide");
  questionElement.classList.remove("hide");
  answersContainer.classList.remove("hide");
  correctCount.classList.remove("hide");
  loadQuestion(currentQuestion);
}

function loadQuestion(questionNum) {
  // ending page
  if (currentQuestion === questions.length) {
    if (correct >= 6) {
      // passed
      subBtn.classList.remove("hide");

      startBtn.classList.remove("hide");
      nextBtn.classList.add("hide");
      questionElement.classList.add("hide");
      answersContainer.classList.add("hide");
      startBtn.innerHTML = "Restart";

      correctCount.innerHTML = `Correct: ${correct * 10}/${
        questions.length * 10
      }`;
    }

    // not passed:
    startBtn.classList.remove("hide");
    nextBtn.classList.add("hide");
    questionElement.classList.add("hide");
    answersContainer.classList.add("hide");
    startBtn.innerHTML = "Restart";

    correctCount.innerHTML = `Score: ${correct * 10}/${questions.length * 10}`;
    correct = 0;
    currentQuestion = 0;
  } else {
    while (answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }
    // middle questions
    startBtn.classList.remove("hide");
    startBtn.classList.add("next-btn");
    startBtn.innerHTML = "Restart";

    questionElement.innerHTML = questions[questionNum].text;

    const btnGrid = document.createElement("div");
    answersContainer.appendChild(btnGrid);
    questions[questionNum].answers.forEach((answer) => {
      const answerElement = document.createElement("button");
      btnGrid.classList.add("btn-grid");
      answerElement.innerHTML = answer.text;
      answerElement.dataset.correct = answer.correct;
      answerElement.addEventListener("click", (e) => {
        Array.from(btnGrid.children).forEach(
          (element) => (element.disabled = true)
        );
        e.target.dataset.clicked = "true";
        checkAnswer();
      });
      btnGrid.appendChild(answerElement);
    });
    //   answersContainer.dataset.type = "mc";
    // }
    // else if (questions[questionNum].type === "txt") {
    //   const inputElement = document.createElement("input");
    //   const checkBtn = document.createElement("button");
    //   checkBtn.innerHTML = "Check";
    //   checkBtn.classList.add("check-btn");
    //   inputElement.type = "text";
    //   checkBtn.addEventListener("click", (e) => {
    //     checkAnswer();
    //   });
    //   answersContainer.appendChild(inputElement);
    //   answersContainer.appendChild(checkBtn);
    //   answersContainer.dataset.type = "txt";
    // }

    //End types

    // correctCount.innerHTML = `Correct: ${correct}`;
  }
}

function checkAnswer() {
  // Check different types

  //   switch (answersContainer.dataset.type) {
  //     case "mc":
  Array.from(answersContainer.children[0].children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
      if (
        button.dataset.correct === "true" &&
        button.dataset.clicked === "true"
      ) {
        correct++;
        correctCount.innerHTML = `Score: ${correct * 10}/${
          questions.length * 10
        }`;
      }
    } else {
      button.classList.add("wrong");
    }
  });
  currentQuestion++;
  //   break;

  // case "txt":
  //   const qInputElement = answersContainer.children[0];
  //   const foundValues = questions[currentQuestion].answers.find(
  //     (answer) => answer.toUpperCase() === qInputElement.value.toUpperCase()
  //   );
  //   if (foundValues) {
  //     qInputElement.classList.add("correct");
  //     correct++;
  //   } else {
  //     qInputElement.classList.add("wrong");
  //   }
  //   currentQuestion++;
  //   break;

  // default:
  //   return;
  //   break;
  //   }

  //End different types
}
