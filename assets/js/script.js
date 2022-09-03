let mainBox = document.querySelector("#main-box");
let quizBox = document.querySelector("#quiz");
let secondsBox = document.querySelector("#seconds-left");

let secondsLeft = 60;

let quizItem = {
    question: "",
    option0: "",
    option1: "",
    option2: "",
    option3: "",
    answer: -1
}

let highScore = {
    user: "",
    score: 0
}


let quiz = [
    ("Commonly used data types DO NOT include:", "strings", "booleans", "alerts", "numbers", 2 ),
    ("To Justify from left to right, use:", "align-contents", "justify-contents", "align-items", "align-contents", 1 ),
    ("to round the borders use this css attribute:", "border-radius", "box", "box-shadow", "cursor", 0 )
];



function quizStart(){
    // if user wants to start quiz, then start quiz
    return true;
}


function init(){
    secondsBox.textContent = secondsLeft;
    // prompt user if they want to take the quiz?
    if (quizStart()){
        //start countdown
        //-01-display quiz question
        //    take user input
        //    check answer
        //    record score
        //    loop back to 01 until all answers are collected.
        //Record in Highscores array.
        //Display Highscores array.
    }

}


init();



