let htmlBtn = document.querySelector(".before-quiz .btns .html");
let cssBtn = document.querySelector(".before-quiz .btns .css");
let jsBtn = document.querySelector(".before-quiz .btns .js");

let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let resultsBox = document.querySelector(".result");

let questionsNumbers = 10;
let current = 0;
rAnswersCounter = 0;
let countDownTimer;
let fileType;

document.querySelectorAll(".before-quiz .btns span").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".before-quiz").style.display = "none";
    document.querySelector(".quiz-app").style.display = "block";
    if (e.target.className === "html") {
      fileType = "Questions_File/html_questions";
    } else if (e.target.className === "css") {
      fileType = "Questions_File/css_questions";
    } else {
      fileType = "Questions_File/js_questions";
    }
    getQuestions();
  });
});

async function getQuestions() {
  let response = await fetch(`${fileType}.json`);
  let json = await response.json();

  let quizQuestions = [];
  let randomIndex;
  for (let i = 0; i < questionsNumbers; i++) {
    randomIndex = Math.floor(Math.random() * json.length);
    quizQuestions.push(json[randomIndex]);
    json.splice(randomIndex, 1);
  }

  createBullets(quizQuestions.length);
  addQuestionData(quizQuestions[current], quizQuestions.length);
  countDown(120, quizQuestions.length);

  submitBtn.onclick = () => {
    checkAnswer(quizQuestions[current].rightAnswer);
    addQuestionData(quizQuestions[++current], quizQuestions.length);
    handleBullets(quizQuestions.length);
    clearInterval(countDownTimer);
    countDown(120, quizQuestions.length);
    showResults(quizQuestions.length);
  };
}

function createBullets(qCount) {
  document.querySelector(".category span").innerHTML = `${fileType
    .split("_")[0]
    .toUpperCase()}`;
  document.querySelector(".count span").innerHTML = qCount;
  for (let i = 0; i < qCount; i++) {
    document.querySelector(
      ".bullets-box .spans-container"
    ).innerHTML += `<span></span>`;
    if (i === 0) {
      document.querySelector(".spans-container span").className = "on";
    }
  }
}

function addQuestionData(obj, qCount) {
  if (current < qCount) {
    quizArea.innerHTML = `<h2>${obj["title"]}</h2>`;

    answersArea.innerHTML = "";
    for (let i = 0; i < obj.answers.length; i++) {
      let answerBox = document.createElement("div");
      answerBox.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "ques_answer";
      radioInput.id = `answer_${i + 1}`;
      if (i === 0) {
        radioInput.checked = true;
      }
      radioInput.setAttribute("data-answer", obj.answers[i]);

      let label = document.createElement("label");
      label.htmlFor = `answer_${i + 1}`;
      let labelText = document.createTextNode(obj.answers[i]);
      label.appendChild(labelText);

      answerBox.appendChild(radioInput);
      answerBox.appendChild(label);
      answersArea.appendChild(answerBox);
    }
  }
}

function checkAnswer(rAnswer) {
  let choosenAnswer;
  document.querySelectorAll(".answers-area input").forEach((input) => {
    if (input.checked) {
      choosenAnswer = input.getAttribute("data-answer");
    }
  });

  if (choosenAnswer === rAnswer) {
    rAnswersCounter++;
  }
}
function handleBullets(qCount) {
  if (current < qCount) {
    document
      .querySelectorAll(".bullets-box .spans-container span")
      [current].classList.add("on");
  }
}

function showResults(qCount) {
  let finalMsg;

  if (current === qCount) {
    resetPage();
    if (rAnswersCounter > qCount / 2 && rAnswersCounter < qCount) {
      finalMsg = `<span class="good">Good</span> You Answered ${rAnswersCounter} From ${qCount}.`;
    } else if (rAnswersCounter === qCount) {
      finalMsg = `<span class="perfect">Perfect</span> All Answers Is Right.`;
    } else {
      finalMsg = `<span class="bad">Bad</span> You Answered ${rAnswersCounter} From ${qCount}.`;
    }
    resultsBox.innerHTML = finalMsg;
  }
}

function resetPage() {
  quizArea.remove();
  answersArea.remove();
  submitBtn.remove();
  document.querySelector(".bullets-box").remove();
}

function countDown(duration, qCount) {
  if (current < qCount) {
    let minutes, seconds;
    countDownTimer = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes > 10 ? minutes : `0${minutes}`;
      seconds = seconds > 10 ? seconds : `0${seconds}`;

      document.querySelector(".timer").innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownTimer);
        submitBtn.click();
      }
    }, 1000);
  }
}
