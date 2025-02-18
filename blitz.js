const inputBox = document.getElementById("inputbox");
const questionContainer = document.getElementById("question");
const skipButton = document.getElementById("skipbutton");

const startButton = document.getElementById("startbutton");
const startDiv = document.getElementById("startdiv");

const timer = document.getElementById("time");
const numAnswers = document.getElementById("numanswers");

var currentQuestion;
var currentAnswer;
var timerValue;

function getNewQuestion() {
    console.log(inputBox.value);
    fetch("assets/questions.json")
        .then(response => response.json())
        .then(data => {
            var randomObject = data[String(Math.floor(Math.random() * 4358) + 1)];
            currentQuestion = randomObject["question"];
            currentAnswer = randomObject["answer"];
            console.log(currentQuestion);
            console.log(currentAnswer);
            questionContainer.innerHTML = currentQuestion;
        })
        .catch(error => console.error('Error loading JSON:', error));
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
            
            numAnswers.innerHTML = parseInt(numAnswers.innerHTML) + 1;
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
}

function fadeOut(element) {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "fadeOut 300ms ease";
}

function skipQuestion() {
    
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

function startTimer() {
    timerValue = 60;
    timer.innerHTML = timerValue;

    let interval = setInterval(() => {
        timerValue -= 1;
        timer.innerHTML = timerValue;
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        timer.innerHTML = 0;
        timer.parentElement.remove();
    }, 60000);
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

startButton.addEventListener("click", e => {
    fadeOut(startButton);

    startDiv.remove();
    setTimeout(() => {
        startButton.style.opacity = "0%";

        inputBox.style.animation = "none";
        void inputBox.offsetWidth;
        inputBox.style.animation = "fadeIn 300ms ease";

        questionContainer.style.animation = "none";
        void questionContainer.offsetWidth;
        questionContainer.style.animation = "fadeIn 300ms ease";

        skipButton.style.animation = "none";
        void skipButton.offsetWidth;
        skipButton.style.animation = "fadeIn 300ms ease";
        setTimeout(() => {
            inputBox.style.opacity = "100%";
            questionContainer.style.opacity = "100%";
            skipButton.style.opacity = "100%";
            startTimer();
        })
    }, 500);

})

inputBox.style.opacity = "0%";
questionContainer.style.opacity = "0%";
skipButton.style.opacity = "0%";

getNewQuestion();

