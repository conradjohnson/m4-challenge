
// grab html elements for 
let mainBox = document.querySelector("#main-box");
let mainQuestion = document.querySelector("#main-question");
let quizList = document.querySelector("#quiz-ol");
let quizBox = document.querySelector("#quiz");
let secondsBox = document.querySelector("#seconds-left");
let questionResult = document.querySelector("#question-result");

// set initial values
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

// object for highscores
let userScore = {
    user:"",
    score: 0
}

// high score array
let highScores = [];
//what quiz item are we on?
let quizIndex = 0;
// temp array for localstorage
let localHighScores = [];


// when an action is taken in our quiz area, do something.
quizBox.addEventListener("click", clickHandler);


function clickHandler(event){
    var element = event.target;
    //Check to see if this is a li click.
    if (element.matches("li") === true) {
        //get the index to see if we're in a quiz, starting a quiz, submitting a high score or just viewing high scores.
        let index = element.getAttribute("data-index");
        //if empty index, do nothing.
        if (index == null){
            return;
        }
        //if starting the quiz, then let's start the quiz
        if (index == -1){
            // index tells us to start quiz
            //call start quiz function
            quizStart();
            return;
        } else if (index == -2){
            // index tells us to populate the high score
            //call populate high score list
            populateHighScores();
            return;
        } else if (index == -3){
            // index tells us to store the high score
            // store the user value
            let user = document.querySelector("#score-name").value
            // send the user value to collectHighScore function
            collectHighScore(user);
            // call populate high score list
            populateHighScores();
            return;
        } else if (index >= 0) {
            // index tells us this is an answer to a question
            // let's check the answer
            checkAnswer(index);
            return;
        } else {
            // catch all to do nothing on other values
            return;
        }
       
    }

}

// function to start the quiz.
function quizStart(){
    // if user wants to start quiz, then start quiz
    // set localStorage and variable for current score to 0
    localStorage.setItem("currentScore", "0");
    // call start timer function
    startTimer();
    // set current score to 0
    currentScore = 0;
    // set stoptimer flag to false.
    stopTimer = false;
    // reset the seconds left, incase this is a 2nd quiz.
    secondsLeft = 60;
    // set the questions quiz index to first in array.
    quizIndex = 0;
    // call the populate quiz function with the first index in the array.
    populateQuiz(quizIndex);
    // return
    return true;
}


// function to begin and stop timer.
function startTimer() {
    // Sets interval in variable so we can stop later
    var timerInterval = setInterval(function() {
      // for every second, update the seconds left
      secondsBox.textContent = secondsLeft;

      //  for every second, if there aren't any seconds left 
      //   or if we've flagged stopTimer,
      //    then stop the quiz and the timer.
      if((secondsLeft === 0)|| stopTimer) {
        // end quiz and stop timer
        quizStop();
        clearInterval(timerInterval);
      }

      //decrement seconds left 
      secondsLeft--;
      
  
    }, 1000);
  }

// function to populate the quiz question list
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

// function to check the answer based on the answerIndex and the current quiz index
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
        // not the end of the quiz, let's go to the next question.
        populateQuiz(quizIndex);
    }
 
}

// function to stop the quiz.
function quizStop(){
    
    // Display Score
    mainQuestion.textContent = "Quiz Complete! Your Score: "+ currentScore;
   
    //clear out old list
    quizList.innerHTML = "";
   
    //clear last result
    questionResult.textContent = "";
   
    //  prompt for user info
    let liEl = document.createElement("li");
   
    // create input object
    let inputEl = document.createElement("input");
    inputEl.setAttribute("type", "text");
    inputEl.setAttribute("length", 2);
   
    // put the score in there to collect if submitted.
    inputEl.setAttribute("id", "score-name");
   
    // add to li
    liEl.appendChild(inputEl);
   
    // add to ol
    quizList.appendChild(liEl);
   
    // make a submit button
    liEl = document.createElement("li");
   
    // assign collect score index
    liEl.setAttribute("data-index", -3);
   
    // label button
    liEl.textContent = "Submit Score";
   
    // append to ol
    quizList.appendChild(liEl);
   
    // give user 'view high score' option instead of entering score.
    liEl = document.createElement("li");
    liEl.setAttribute("data-index", -2);
    liEl.textContent = "View High Scores";
    quizList.appendChild(liEl);
   
    // give user 'take quiz again' option instead of entering score or viewing high scores.
    liEl = document.createElement("li");
    liEl.setAttribute("data-index", -1);
    liEl.textContent = "Take Quiz Again!";
    quizList.appendChild(liEl);

    
    // stop timer flag
    stopTimer = true;

}

// function to populate the high scores list.
function populateHighScores(){
    
    
    // get high scores from local storage or return empty array if it doesn't exist.
    localHighScores = JSON.parse(localStorage.getItem("highScores") || "[]");
    //Set Title
    mainQuestion.textContent = "High Score List"
    //clear the list to populate
    quizList.innerHTML = "";

    // give user option to start quiz from this menu.
    let liEl = document.createElement("li");
    liEl.textContent = "Start Quiz";
    liEl.setAttribute("data-index", "-1");
    quizList.appendChild(liEl);

    // check to see if there are any items to display.
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
        // if no high scores yet, then tell user.
        liEl = document.createElement("li");
        liEl.textContent = "No High Scores Yet!";
        quizList.appendChild(liEl);
    }
    
    return;
}


// function to collect the high score and add it to already existing localstorage high scores
function collectHighScore(userName){
    //build object to store
    userScore = {
        user: userName,
        score: currentScore
    }

    //retrieve array from local storage.  if one does not exist, then return an empty array
    highScores = JSON.parse(localStorage.getItem("highScores")|| "[]");

    //push user score object onto array
    highScores.push(userScore);

    //replace high scores array with updated array.
    localStorage.setItem("highScores", JSON.stringify(highScores));

}