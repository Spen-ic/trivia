const inputBox = document.getElementById("inputbox");
const questionContainer = document.getElementById("question");
const skipButton = document.getElementById("skipbutton");

var currentQuestion;
var currentAnswer;

function getNewQuestion() {
    console.log(inputBox.value);
    fetch("/questions.json")
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
    if (input.toUpperCase() == currentAnswer.toUpperCase()) {
        inputBox.style.animation = "none";
        void inputBox.offsetWidth;
        questionContainer.style.animation = "none";
        void questionContainer.offsetWidth;
        
        inputBox.style.animation = "greenFade 1500ms ease";
        questionContainer.style.animation = "questionFade 800ms ease";
        
        inputBox.value = "";
        setTimeout(getNewQuestion, 400);
    }
}

function skipQuestion() {
    let input = inputBox.value;

    
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


getNewQuestion();

