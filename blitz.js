const inputBox = document.getElementById("inputbox");
const inputDiv = document.getElementById("inputdiv")
const questionContainer = document.getElementById("question");
const skipButtonDiv = document.getElementById("skipbuttondiv");
const skipButton = document.getElementById("skipbutton");

const infoDiv = document.getElementById("pdiv");
const bDiv = document.getElementById("bdiv");

const startButton = document.getElementById("startbutton");
const startDiv = document.getElementById("startdiv");

const blitzDynamic = document.getElementById("blitzinfo");
const timer = document.getElementById("time");
const numAnswers = document.getElementById("numanswers");
const skippedQuestionsDiv = document.getElementById("sqdiv");
const skippedQuestionsNum = document.getElementById("skippedquestions");
const scoreDiv =document.getElementById("scorediv");
const scoreNum = document.getElementById("score");
const playAgainDiv = document.getElementById("playagain");
const playAgainButton = document.getElementById("playagainbutton");

const allottedTime = 60;
var currentQuestion;
var currentAnswer;
var timerValue;
var questionsSkipped;
var correctAnswers;

var jsonData;
var dataLength;

// get json data initially (once) instead of upon each question
fetch("assets/questions.json")
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            dataLength = Object.keys(data).length;
            console.log(dataLength)

            initialize();
        })
        .catch(error => console.error('Error loading JSON:', error));

function getNewQuestion() {
    console.log(dataLength)
    var randomObject = jsonData[String(Math.floor(Math.random() * dataLength) + 1)];
    currentQuestion = randomObject["question"];
    currentAnswer = randomObject["answer"];
    console.log(currentQuestion);
    console.log(currentAnswer);
    questionContainer.innerHTML = currentQuestion;
}

function checkAnswer() {
    let input = inputBox.value;

    inputBox.style.backgroundColor = "white";

    for (let i = 0; i < currentAnswer.length; i++) {
        if (input.toUpperCase() == currentAnswer[i].toUpperCase()) {
            inputBox.style.animation = "none";
            void inputBox.offsetWidth;
            questionContainer.style.animation = "none";
            void questionContainer.offsetWidth;
            
            inputBox.style.animation = "greenFade 1500ms ease";
            questionContainer.style.animation = "questionFade 800ms ease";
            
            correctAnswers++;
            numAnswers.innerHTML = correctAnswers;
            numAnswers.style.animation = "none";
            void numAnswers.offsetWidth;
            numAnswers.style.animation = "greenTextFade 1500ms ease";
            
            inputBox.value = "";
            setTimeout(getNewQuestion, 400);
            return;
        }
    }
}

function fadeIn(element) {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "fadeIn 300ms ease";
    
    setTimeout(() => {
        element.style.opacity = "100%";
    }, 300);
}

function fadeOut(element) {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "fadeOut 300ms ease";

    setTimeout(() => {
        element.style.opacity = "0%";
    }, 300);
}

function add(element) {
    element.style.display = "flex";
}

function rem(element) {
    element.style.display = "none";
}

function skipQuestion() {
    questionsSkipped++;
    
    inputBox.style.backgroundColor = "white";
    inputBox.style.animation = "none";
    void inputBox.offsetWidth;
    questionContainer.style.animation = "none";
    void questionContainer.offsetWidth;
    
    inputBox.style.animation = "redFade 1500ms ease";
    questionContainer.style.animation = "questionFade 800ms ease";

    inputBox.value = "";
    setTimeout(getNewQuestion, 400);
}

function endTimer() {
    fadeOut(questionContainer);
    fadeOut(inputBox);
    fadeOut(skipButtonDiv);

    setTimeout(() => {
        rem(questionContainer);
        rem(inputBox);
        rem(skipButtonDiv);

        add(skippedQuestionsDiv);

        skippedQuestionsNum.innerHTML = questionsSkipped;
        if (correctAnswers > 0) {
            scoreNum.innerHTML = Math.floor(correctAnswers * (100 * correctAnswers / (correctAnswers + questionsSkipped)));
        } else {
            scoreNum.innerHTML = 0;
        }

        fadeIn(skippedQuestionsDiv);

        setTimeout(() => {
            add(scoreDiv);
            add(scoreNum);
            add(playAgainDiv);

            fadeIn(scoreDiv);
            fadeIn(scoreNum);
            fadeIn(playAgainDiv);
        }, 1000);
    }, 1500);
}

function startTimer() {
    timerValue = allottedTime;
    timer.innerHTML = timerValue;

    let interval = setInterval(() => {
        timerValue -= 1;
        timer.innerHTML = timerValue;
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        timer.innerHTML = 0;
        rem(timer.parentElement);

        endTimer();
    }, 1000 * allottedTime);
}

inputBox.addEventListener("keyup", e => {
    if (e.key == "Enter" && window.getComputedStyle(questionContainer).getPropertyValue("opacity") == 1) {
        skipQuestion();
    } else {
        checkAnswer();
    }
});

skipButton.addEventListener("click", e => {
    if (window.getComputedStyle(questionContainer).getPropertyValue("opacity") == 1) {
        skipQuestion();
    }
})

playAgainButton.addEventListener("click", e => {
    if (window.getComputedStyle(playAgainButton).getPropertyValue("opacity") == 1){
        location.reload();
    }
})

startButton.addEventListener("click", e => {
    fadeOut(startButton);

    rem(startDiv);
    rem(bDiv);
    rem(infoDiv);
    add(blitzDynamic);
    add(inputDiv);
    add(questionContainer);
    add(skipButtonDiv);
    setTimeout(() => {
        startButton.style.opacity = "0%";

        fadeIn(blitzDynamic);
        fadeIn(inputBox);
        fadeIn(questionContainer);
        fadeIn(skipButtonDiv);

        setTimeout(() => {
            blitzDynamic.style.opacity = "100%";
            inputBox.style.opacity = "100%";
            questionContainer.style.opacity = "100%";
            skipButtonDiv.style.opacity = "100%";
            startTimer();
        })
    }, 500);

})

function initialize() {
    inputBox.style.opacity = "0%";
    questionContainer.style.opacity = "0%";
    skipButtonDiv.style.opacity = "0%";
    blitzDynamic.style.opacity = "0%";
    
    correctAnswers = 0;
    questionsSkipped = 0;
    getNewQuestion();
}

