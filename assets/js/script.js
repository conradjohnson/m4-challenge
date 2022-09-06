
// grab html elements for 
let mainBox = document.querySelector("#main-box");
let mainQuestion = document.querySelector("#main-question");
let quizList = document.querySelector("#quiz-ol");
let quizBox = document.querySelector("#quiz");
let secondsBox = document.querySelector("#seconds-left");
let questionResult = document.querySelector("#question-result");

let currentScore = 0;

let secondsLeft = 60;
let stopTimer = false;

let questions = [
    {question: "Commonly used data types DO NOT include:", answers:["strings","booleans","alerts","numbers" ], correctAnswer:"2"},
    {question: "To align items from left to right, use:", answers:["align-contents","justify-contents","align-items","align-contents" ], correctAnswer:"1"},
    {question: "to round the borders use this css attribute:", answers:["border-radius","box","box-shadow","cursor" ], correctAnswer:"0"},
    {question: "To align items from top to bottom, use:", answers:["align-contents","justify-contents","align-items","align-contents"], correctAnswer:"2"},
    {question: "Commonly used message displays DO include:", answers:["strings","booleans","alerts","numbers"], correctAnswer:"2"}
]

let retry = {
    msg: "Want to take the Coding Quiz Challenge again?"
}

let userScore = {
    user:"",
    score: 0
}

let highScores = [];

let quizIndex = 0;
let localHighScores = [];


quizBox.addEventListener("click", clickHandler);


function clickHandler(event){
    var element = event.target;
    //Check to see if this is a li click.
    if (element.matches("li") === true) {
        //get the index to see if we're in a quiz, starting, or just viewing high scores.
        let index = element.getAttribute("data-index");
        //if empty index, do nothing.
        if (index == null){
            return;
        }
        //if starting the quiz, then let's start the quiz
        if (index == -1){
            quizStart();
            return;
        } else if (index == -2){
            populateHighScores();
            return;
        } else if (index == -3){
            let user = document.querySelector("#score-name").value
            collectHighScore(user);
            populateHighScores();
            return;
        } else if (index >= 0) {
            checkAnswer(index);
            return;
        } else {
            return;
        }
       
    }

}

function collectHighScore(userName){
    userScore = {
        user: userName,
        score: currentScore
    }
    highScores = JSON.parse(localStorage.getItem("highScores")|| "[]");
    highScores.push(userScore);
    localStorage.setItem("highScores", JSON.stringify(highScores));

}

function checkAnswer(answerIndex){
    // see if answerIndex matches answer @ quizIndex
    if (answerIndex != questions[quizIndex].correctAnswer){
        // if incorrect, set result and deduct time
        questionResult.textContent = "Incorrect :( ";
        secondsLeft = secondsLeft -10;
    } else{
        // if correct calculate score
        currentScore = parseInt(localStorage.getItem("currentScore"));
        currentScore = currentScore + 20;
        // store score in local storage
        localStorage.setItem("currentScore", currentScore);
        // set the answer message to results
        questionResult.textContent = "Correct!";
    }
     
    // advance quiz index
    quizIndex++;

    // if end of quiz
    if (quizIndex == questions.length){
        // then end the quiz
        quizStop();
    } else{
        populateQuiz(quizIndex);
    }
    


}



function populateQuiz (qIndex){
   
    
    // set the h2 in mainBox to question
    mainQuestion.textContent = questions[qIndex].question;

    //clear out old list
    quizList.innerHTML = "";
        
    //populate new list
    for (i = 0; i<questions[qIndex].answers.length; i++ ){
        // create the li object
        var liEl = document.createElement("li");
        liEl.setAttribute("data-index", i);
        liEl.textContent = questions[qIndex].answers[i];
        // append to ol
        quizList.appendChild(liEl);
    }
    
}

function quizStart(){
    // if user wants to start quiz, then start quiz
    // set localStorage and variable for current score to 0
    localStorage.setItem("currentScore", "0");
    startTimer();
    currentScore = 0;
    stopTimer = false;
    secondsLeft = 60;
    quizIndex = 0;

    populateQuiz(quizIndex);
    return true;
}

function quizStop(){
    
    // Display Score
    mainQuestion.textContent = "Quiz Complete! Your Score: "+ currentScore;
    //clear out old list
    quizList.innerHTML = "";
    //clear last result
    questionResult.textContent = "";
    //      prompt for user info
    let liEl = document.createElement("li");
    
    let inputEl = document.createElement("input");
    inputEl.setAttribute("type", "text");
    inputEl.setAttribute("length", 2);
    inputEl.setAttribute("id", "score-name");
    liEl.appendChild(inputEl);
    quizList.appendChild(liEl);
    // make a submit button
    liEl = document.createElement("li");
    liEl.setAttribute("data-index", -3);
    liEl.textContent = "Submit Score";
    quizList.appendChild(liEl);
    liEl = document.createElement("li");
    liEl.setAttribute("data-index", -2);
    liEl.textContent = "View High Scores";
    quizList.appendChild(liEl);
    // add take quiz again
    
    // stop timer
    stopTimer = true;

}

function startTimer() {
    // Sets interval in variable
    var timerInterval = setInterval(function() {
      secondsBox.textContent = secondsLeft;
      if((secondsLeft === 0)|| stopTimer) {
        // end quiz and stop timer
        quizStop();
        clearInterval(timerInterval);
        
      }
      secondsLeft--;
      
  
    }, 1000);
  }

function populateHighScores(){
    
    
    // get high scores from local storage or return empty array if it doesn't exist.
    localHighScores = JSON.parse(localStorage.getItem("highScores") || "[]");
    //Set Title
    mainQuestion.textContent = "High Score List"
    //clear the list to populate
    quizList.innerHTML = "";
    let liEl = document.createElement("li");
    liEl.textContent = "Start Quiz";
    liEl.setAttribute("data-index", "-1");
    quizList.appendChild(liEl);
    if (localHighScores.length>0){
        // if there are high scores to display
        //sort the array based on score
        localHighScores.sort((a,b) => b.score - a.score);
        
        //display the list of scores
        for (let i = 0;  i<localHighScores.length; i++){
            liEl = document.createElement("li");
            liEl.textContent = "user: " + localHighScores[i].user + " score: " + localHighScores[i].score;
            quizList.appendChild(liEl);
        }
    } else{
        liEl = document.createElement("li");
        liEl.textContent = "No High Scores Yet!";
        quizList.appendChild(liEl);
    }
    
    return;
}


