let quizData;
let startContainer;

const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button");
const resetButton = document.getElementById("reset-button");
const result = document.getElementById("result");
let currentQuestion = 0;
let score = 0;
let shuffledQuizData;
let optionSelected = false;

function startQuiz() {
  startContainer.style.display = "none";
  quizContainer.style.display = "block";
  nextButton.addEventListener("click", nextQuestion);
  resetButton.addEventListener("click", resetQuiz);
  loadQuestion();
}

function loadQuestion() {
  optionSelected = false;
  const currentQuizData = shuffledQuizData[currentQuestion];

  questionContainer.textContent = currentQuizData.question;
  optionsContainer.innerHTML = "";

  currentQuizData.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("btn", "btn-option");
    button.addEventListener("click", () => checkAnswer(option));
    optionsContainer.appendChild(button);
  });

  if (currentQuestion === shuffledQuizData.length - 1) {
    nextButton.textContent = "Submit";
    nextButton.removeEventListener("click", loadQuestion);
    nextButton.addEventListener("click", submitQuiz);
  }

  nextButton.disabled = true;
  questionContainer.style.display = "block";
  optionsContainer.style.display = "block";
  nextButton.style.display = "inline-block";
  resetButton.style.display = "none";
  document.getElementById("description-container").innerHTML = ""; // Reset deskripsi setiap kali pertanyaan diubah
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < shuffledQuizData.length) {
    loadQuestion();
  }
}

function submitQuiz() {
  showResult();
  resetButton.style.display = "inline-block";
  nextButton.style.display = "none";
  nextButton.removeEventListener("click", submitQuiz);
  nextButton.addEventListener("click", nextQuestion);
}
// ​
function checkAnswer(userAnswer) {
  if (!optionSelected) {
    const currentQuizData = shuffledQuizData[currentQuestion];
    const options = optionsContainer.querySelectorAll(".btn-option");

    options.forEach((option) => {
      if (option.textContent === currentQuizData.correctAnswer) {
        option.classList.add("correct");
      } else {
        option.classList.add("wrong");
      }
      option.disabled = true;
    });

    if (userAnswer === currentQuizData.correctAnswer) {
      score++;
      showDescription(true, currentQuizData.descriptionAnswers);
    } else {
      showDescription(false, currentQuizData.descriptionAnswers);
    }

    optionSelected = true;
    nextButton.disabled = false;
  }
}

function showResult() {
  result.textContent = `You scored ${score} out of ${shuffledQuizData.length}.`;
}

function showDescription(isCorrect, description) {
  const descriptionContainer = document.getElementById("description-container");
  const answerText = isCorrect ? "Jawaban Benar:" : "Jawaban yang Benar:";
  const answerClass = isCorrect ? "correct-answer" : "wrong-answer";

  descriptionContainer.innerHTML = `<p class="${answerClass}">${answerText}</p><p class="description-text">${description}</p>`;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  shuffledQuizData = shuffleArray([...quizData]);
  result.textContent = "";
  resetButton.style.display = "none";
  nextButton.style.display = "inline-block";
  nextButton.textContent = "Next";
  window.location.reload();
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

fetch("db/quiz.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = data;
    shuffledQuizData = shuffleArray([...quizData]);
    startContainer = document.createElement("div");
    startContainer.id = "start-container";
    startContainer.innerHTML = "<h2>Apakah Anda siap untuk quiz hari ini?</h2>";
    const startButton = document.createElement("button");
    startButton.id = "start-button";
    startButton.classList.add("btn", "btn-primary");
    startButton.textContent = "Mulai Quiz";
    startButton.addEventListener("click", startQuiz);
    startContainer.appendChild(startButton);
    document.body.appendChild(startContainer);
  })
  .catch((error) => console.error("Error fetching JSON:", error));
