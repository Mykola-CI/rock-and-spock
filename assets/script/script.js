// Utility variables
const maxNumRounds = 5; // Introduced for convenience of game code handler to change maximum number of rounds
const hands = ["rock", "paper", "scissors", "lizard", "spock"]; // Array that consists of strings - id selectors for 5 available gaming hands
const audioClick = new Audio("assets/sounds/421251__jaszunio15__click_121.wav");
const audioPick = new Audio("assets/sounds/28828__junggle__btn018.wav");

// Variables To Control And Manipulate DOM Elements:

// Buttons
const soundToggleButton = document.getElementById("sound-toggle"); // Sound toggle
const backToIntroButton = document.querySelector("#back-to-intro-btn"); // Returns to the intro-screen
const handButtons = document.querySelectorAll(".hand-type--button"); // 5 hands to pick
const startRoundBtn = document.getElementById("start-control"); // Major button to start new round
const backToNewRound = document.getElementById("back-to-new-round-btn"); // Returns player to the playground

// To display text messages
const playgroundTitle = document.getElementById("playground-title");
const countdownDisplays = document.querySelectorAll(".countdown-numbers");
const displayResultTitle = document.getElementById("display-result-title");

// Footer elements - Scores and Round Count displays
const footerScoreTitle = document.querySelector("#footer-item-you>h3");
const footerRoundCount = document.querySelector("#footer-round-count>h3");
const footerYouScore = document.querySelector("#footer-you-score>h3");
const footerSheldonScore = document.querySelector("#footer-sheldon-score>h3");
const footerItemTitle = document.querySelector("#footer-item-title>h3");

// Global Variables To Store Data And Make Them Accessible Across Functions:
let soundEnabled;
let currentRoundCount = parseInt(footerRoundCount.innerText);
let playerName;

// Store the data on selected hands
let indexUser;
let indexComp;
let userChoiceText;
let compChoiceText;

// Service variables to set and cancel timeout and intervals
let timeoutID;
let timeoutReturn;
let countdownValue;
let countdownInterval;

/**
 * the Window load event listener to display Intro screen
 * and provide for its full functionality
 * */
window.onload = (event) => {
  soundEnabled = false; // Load with sound off
  displayIntro();

  footerItemTitle.innerHTML = `Max. Number of Rounds Per Game = ${maxNumRounds}`;

  // Gates to the Playground screen
  const goPlaygroundButton = document.getElementById("start-playground-button");
  goPlaygroundButton.addEventListener("click", function () {
    if (soundEnabled) {
      audioClick.play();
    }
    // Pause video and return to the beginning
    const video = document.querySelector("#intro-video>video");
    video.pause();
    video.currentTime = 0;

    if (playerName) {
      prepareNewRound();
      displayPlayground();
    } else {
      displayInputName();
    }
    // Activate listener to return Player to the Intro screen from the Playground screen
    backToIntroButton.addEventListener("click", displayIntro);
  });
};

/**
 * Listen to the click event on the Sound Toggle button
 */
soundToggleButton.addEventListener("click", toggleSound);

/**
 * Listen to the submit button on the Name Input form, handle player's name input
 */
document.getElementById("input-name-form").addEventListener("submit", function (event) {
  event.preventDefault();
  playerName = document.getElementById("name-player").value;
  if (validateInput(playerName)) {
    footerScoreTitle.innerHTML = `${playerName}`;
    displayPlayground();
  } else {
    // if player's name is not valid, show an error message
    alert("Invalid input. Please enter a name without special characters.");
  }
});

/**
 * The click event on the button starts a round, sets timeout and displays hands to pick
 */
startRoundBtn.addEventListener("click", function () {
  if (soundEnabled) {
    audioClick.play();
  }

  displaySectionClass(".display-clock-hands");
  hideSectionClass(".hide-clock-hands");
  incrementRoundCount();

  // This loop reinstates availability and visibility of 'inactive' hands hidden at the previous round
  for (let index = 0; index < hands.length; index++) {
    displaySection(hands[index]);
  }

  countdownValue = 5; // setting initial value for the countdown
  countdownDisplays.forEach((display) => (display.innerText = countdownValue)); // display initial value of the countdown

  //Sets recurring intervals of 1 sec from 5 to 1 to display countdown sequence
  countdownInterval = setInterval(function () {
    countdownValue--;
    if (countdownValue < 0) {
      clearInterval(countdownInterval);
    } else {
      countdownDisplays.forEach((display) => (display.innerText = countdownValue));
    }
  }, 1000);

  // Generate random integer from 0 to 4, used as Computer's hand index
  indexComp = Math.floor(Math.random() * 5);

  // Set the delay time 5sec for the function defineWinner to execute
  // in case the Player fails to select the hand within 5 sec
  timeoutID = setTimeout(function () {
    hideSection("clock-countdown");
    hideSection("hand-selection");
    displaySection("display-result");
    defineWinner(5, indexComp);
    displaySection("back-to-new-round");
  }, 5000);

  // Clear hand titles from previous round and set listeners for 5 hand buttons
  handButtons.forEach((handButton) => {
    const buttonLabel = handButton.previousElementSibling;
    buttonLabel.innerHTML = "";
    buttonLabel.style.color = "";
    handButton.addEventListener("click", handClickHandler);
  });
});

// EXTERNAL FUNCTIONS

/**
 * Provides for the toggle effect for the sound on/off button
 */
function toggleSound() {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    soundToggleButton.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  } else {
    soundToggleButton.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
  }
}

/**
 * Validate input of Player's name, return boolean
 */
function validateInput(input) {
  // Define the allowed characters - alphanumeric and space)
  const regex = /^[a-zA-Z0-9 ]+$/;

  // Test the input against the regex
  if (!regex.test(input)) {
    return false;
  }
  // If the input passes the test, it's valid
  return true;
}

/**
 * Rearrange the screen to reveal result, launch defineWinner,
 * clear timeout to prevent defineWinner function running the second time
 */
function handClickHandler(event) {
  if (soundEnabled) {
    audioPick.play();
  }

  const clickedHandId = event.currentTarget.id;
  indexUser = hands.indexOf(clickedHandId);

  clearTimeout(timeoutID);
  clearInterval(countdownInterval);

  hideSection("clock-countdown");
  displaySection("display-result");
  displaySection("back-to-new-round");

  userChoiceText = handButtons[indexUser].previousElementSibling;
  compChoiceText = handButtons[indexComp].previousElementSibling;

  // Display titles to show which hands picked by Player and Computer
  if (indexUser === indexComp) {
    userChoiceText.innerHTML = "Tie!";
  } else {
    userChoiceText.innerHTML = `${playerName}`;
    compChoiceText.innerHTML = "Sheldon";
  }

  // This loop removes hands except those of Player and Computer
  for (let index = 0; index < hands.length; index++) {
    if (index !== indexUser && index !== indexComp) {
      hideSection(hands[index]);
    }
  }

  // Remove listeners form all hands after the choice has been made
  handButtons.forEach((handButton) => {
    handButton.removeEventListener("click", handClickHandler);
  });

  defineWinner(indexUser, indexComp);
}

/**
 * Remove listeners before the new round and clear scores before the new game
 */
function prepareNewRound() {
  backToNewRound.removeEventListener("click", clearTimeNewRound); // must be removed before new game of 5 rounds starts
  backToNewRound.removeEventListener("click", clearTimeIntroResults); // if not removed they remain attached and cause bugs in conditional statements

  if (currentRoundCount > maxNumRounds - 1) {
    clearScores();
  }
}

/**
 * Function hiding a section with a specified id
 */
function hideSection(id) {
  const hideElement = document.getElementById(id);
  hideElement.classList.add("hidden");
}

/**
 * Function hiding all sections with a specified class name
 */
function hideSectionClass(className) {
  const elements = document.querySelectorAll(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.add("hidden");
  }
}

/**
 * Function displaying a section with a specified id
 */
function displaySection(id) {
  const displayElement = document.getElementById(id);
  displayElement.classList.remove("hidden");
}

/**
 * Function displaying all sections with a specified class name
 */
function displaySectionClass(className) {
  const elements = document.querySelectorAll(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("hidden");
  }
}

/**
 * Display the Intro screen with video and rules
 */
function displayIntro() {
  displaySectionClass(".display-intro");
  hideSectionClass(".hide-intro");
}

/**
 * Display the Playground screen, update the title with the Player's name
 */
function displayPlayground() {
  displaySectionClass(".display-playground");
  hideSectionClass(".hide-playground");
  playgroundTitle.innerHTML = `Well, ${playerName}! You'll have 5 sec to pick a hand!`;
}

/**
 * Display the screen for the Player's name input
 */
function displayInputName() {
  displaySection("input-name");
  displaySection("back-to-intro");
  hideSection("intro");
  hideSection("playground");
  hideSection("clock-countdown");
  hideSection("display-result");
  hideSection("hand-selection");
  hideSection("back-to-new-round");
}

/**
 * Major function that defines the winner and display the result messages,
 * increment the scores and colorize 'red' the winner's hand title
 */
function defineWinner(userHand, compHand) {
  if (compHand === userHand) {
    displayResultTitle.innerText = "Yahoo! It's a tie!";
  } else if (
    (userHand === 0 && (compHand === 2 || compHand === 3)) ||
    (userHand === 1 && (compHand === 0 || compHand === 4)) ||
    (userHand === 2 && (compHand === 1 || compHand === 3)) ||
    (userHand === 3 && (compHand === 1 || compHand === 4)) ||
    (userHand === 4 && (compHand === 0 || compHand === 2))
  ) {
    displayResultTitle.innerText = `You win, ${playerName}! ${hands[userHand]} beats ${hands[compHand]}  👍`;
    userChoiceText.style.color = "red";
    incrementScorePlayer();
  } else if (userHand === 5) {
    displayResultTitle.innerText = `Oi! No hand picked! Pity, you loose anyway!  👎`;
    incrementScoreSheldon();
  } else {
    displayResultTitle.innerText = `Ups! Bad Luck, ${playerName} ! ${hands[compHand]} beats ${hands[userHand]}  👎`;
    compChoiceText.style.color = "red";
    incrementScoreSheldon();
  }

  //The condition that checks the maximum number of rounds and returns Player to a New Round or to the Intro screen
  if (currentRoundCount <= maxNumRounds - 1) {
    // Automatically return Player to the Playground screen in 10sec where Player can start a new round
    timeoutReturn = setTimeout(function () {
      displayPlayground();
    }, 10000);

    // On click - return Player to the Playground screen, clear the timeout
    backToNewRound.addEventListener("click", clearTimeNewRound);
  } else {
    // Automatically return Player to the Intro screen in 10sec if maximum number of rounds has been reached
    timeoutReturn = setTimeout(function () {
      displayIntro();
      lastGameResults();
    }, 10000);

    // On click - return Player to the Intro screen when max number of rounds reached, clear the timeout
    backToNewRound.addEventListener("click", clearTimeIntroResults);
  }
}

/**
 * Clear timeout and return to the Playground
 */
function clearTimeNewRound() {
  clearTimeout(timeoutReturn);
  displayPlayground();
}

/**
 * Clear timeout and return to the Intro screen
 */
function clearTimeIntroResults() {
  clearTimeout(timeoutReturn);
  displayIntro();
  lastGameResults();
}

/**
 * Increment the Player's score
 */
function incrementScorePlayer() {
  let oldScorePlayer = parseInt(footerYouScore.innerText);
  footerYouScore.innerText = ++oldScorePlayer;
}

/**
 * Increment the Computer's score
 */
function incrementScoreSheldon() {
  let oldScoreSheldon = parseInt(footerSheldonScore.innerText);
  footerSheldonScore.innerText = ++oldScoreSheldon;
}

/**
 * Increment the number of rounds played
 */
function incrementRoundCount() {
  // let oldCount = parseInt(footerRoundCount.innerText);
  footerRoundCount.innerText = ++currentRoundCount;
}

/**
 * Clear all scores to start a new round and assign the initial text to the footer title
 */
function clearScores() {
  footerRoundCount.innerText = 0;
  footerSheldonScore.innerText = 0;
  footerYouScore.innerText = 0;
  currentRoundCount = 0;
  footerItemTitle.innerText = `Max. Number Of Rounds Per Game = ${maxNumRounds}`;
}

/**
 * Display messages to the intro screen Footer about a Winner or a tie after the game has ended,
 * i.e. the maximum number of rounds has been played
 */
function lastGameResults() {
  let lastScorePlayer = parseInt(footerYouScore.innerText);
  let lastScoreSheldon = parseInt(footerSheldonScore.innerText);
  if (lastScoreSheldon > lastScorePlayer) {
    footerItemTitle.innerText = `Ah! You lost the last game: ${lastScorePlayer} to ${lastScoreSheldon} 🥱`;
  } else if (lastScoreSheldon < lastScorePlayer) {
    footerItemTitle.innerText = `Hey! You won the last game: ${lastScorePlayer} to ${lastScoreSheldon} 🤥`;
  } else {
    footerItemTitle.innerText = `You managed to tie with me! 🤔`;
  }
}
