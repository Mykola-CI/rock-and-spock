const footerRoundCount = document.querySelector("#footer--round-count>h3");
let currentRoundCount = parseInt(footerRoundCount.innerText);
let soundEnabled;

/**
 * Setting event listener on the Window load to display intro screen
 * and provide for full functionality
 * */
window.onload = (event) => {
  displayIntro();

  const goPlaygroundButton = document.getElementById("start-playground--button");
  const video = document.querySelector("#intro-video>video");
  soundEnabled = false;

  /**
   * Setting event listener for the only button on the intro screen that gets you
   * to the Playground screen
   */
  goPlaygroundButton.addEventListener("click", function () {
    if (soundEnabled) {
      audioClick.play();
    }
    video.pause();
    video.currentTime = 0;
    displayPlayground();
    displayResultDiv.removeEventListener("click", clearTimeNewRound); // must be removed before new game of 10 rounds starts
    displayResultDiv.removeEventListener("click", clearTimeIntroResults); // if not removed they remain attached and cause bugs in conditional statements

    if (currentRoundCount > 3) {
      clearScores();
    }

    /**
     * Listens to the button click to return the player to the Intro screen
     */
    backToIntroButton.addEventListener("click", displayIntro);
  });
};

const backToIntroButton = document.querySelector("#back-to-intro-btn");
const hands = ["rock", "paper", "scissors", "lizard", "spock"]; // Array that consists of strings - id selectors of 5 available gaming hands
const handButtons = document.querySelectorAll(".hand-type--button");
const startRoundBtn = document.getElementById("start-control");
const audioClick = new Audio("assets/sounds/421251__jaszunio15__click_121.wav");
const audioPick = new Audio("assets/sounds/28828__junggle__btn018.wav");
const countdownDisplays = document.querySelectorAll(".countdown-numbers");

let timeoutID;
let timeoutReturn;
let countdownValue;
let countdownInterval;
let indexUser;
let indexComp;

const soundToggleButtons = document.getElementsByClassName("sound-toggle");
/**
 * Loop that iterates 2 identical icons at top left and right corners of the header.
 * It adds event listeners to toggle sounds. Both icons operate the same way
 */
for (let icon of soundToggleButtons) {
  icon.addEventListener("click", toggleSound);
}

const displayResultDiv = document.getElementById("display-result");
const displayResultTitle = document.getElementById("display-result--title");
const footerYouScore = document.querySelector("#footer--you-score>h3");
const footerSheldonScore = document.querySelector("#footer--sheldon-score>h3");
const footerItemTitle = document.querySelector("#footer--item-title>h3");

/**
 * the click event on the button starts a round, sets timeout and displays hands to pick
 */
startRoundBtn.addEventListener("click", function () {
  if (soundEnabled) {
    audioClick.play();
  }

  displaySectionClass(".display-clock-hands");
  hideSectionClass(".hide-clock-hands");
  incrementRoundCount();

  // This loop reinstates availability and visibility of 'inactive' hands hidden at the previous round
  // - refer to the respective loop in defineWinner function
  for (let index = 0; index < hands.length; index++) {
    displaySection(hands[index]);
  }

  countdownValue = 5; // this is for countdown starting from 5 in sec.
  countdownDisplays.forEach((display) => (display.innerText = countdownValue)); // displays initial number of the countdown left and right from the running clock
  /**
   * Sets recurring intervals of 1 sec from 5 to 1
   */
  countdownInterval = setInterval(function () {
    countdownValue--;
    if (countdownValue < 0) {
      clearInterval(countdownInterval);
    } else {
      countdownDisplays.forEach((display) => (display.innerText = countdownValue));
    }
  }, 1000);

  indexComp = Math.floor(Math.random() * 5); // Generates random integer from 0 to 4, treated as Computer's hand
  /**
   * Sets the delay time 5sec for the function defineWinner to implement
   * in case the Player fails to select the hand within 5 sec
   */
  timeoutID = setTimeout(function () {
    hideSection("clock-countdown");
    hideSection("hand-selection");
    displaySection("display-result");
    defineWinner(5, indexComp);
  }, 5000);

  /**
   * On click event launches the handClickHandler function, which deals with the selected hand
   */
  handButtons.forEach((handButton) => {
    const buttonLabel = handButton.previousElementSibling;
    buttonLabel.innerHTML = "";
    handButton.addEventListener("click", handClickHandler);
  });
});

/**
 * Rearrange the screen to reveal result, launch defineWinner,
 * clear timeout to prevent defineWinner function run the second time
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

  let userChoiceText = handButtons[indexUser].previousElementSibling;
  let compChoiceText = handButtons[indexComp].previousElementSibling;

  if (indexUser === indexComp) {
    userChoiceText.innerHTML = "Tie!";
  } else {
    userChoiceText.innerHTML = "Your choice";
    compChoiceText.innerHTML = "Sheldon's choice";
  }

  // This loop hides inactive hands left after Player and Computer have picked theirs
  for (let index = 0; index < hands.length; index++) {
    if (index !== indexUser && index !== indexComp) {
      hideSection(hands[index]);
    }
  }

  /**
   * Removes listeners after hand has been selected by Player to prevent
   * from multiple defineWinner running
   */
  handButtons.forEach((handButton) => {
    handButton.removeEventListener("click", handClickHandler);
  });

  defineWinner(indexUser, indexComp);
}

/**
 * Provides for the toggle effect for one and the same button
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  for (let icon of soundToggleButtons) {
    if (soundEnabled) {
      icon.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    } else {
      icon.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
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

function displayIntro() {
  displaySectionClass(".display-intro");
  hideSectionClass(".hide-intro");
}

function displayPlayground() {
  displaySectionClass(".display-playground");
  hideSectionClass(".hide-playground");
}

/**
 * Major function that randomly generates computer's hand.
 * Executes the logic of defining the winner and display the result messages
 */
function defineWinner(userHand, compHand) {
  // This condition defines Winner for the round and handles scores
  if (compHand === userHand) {
    displayResultTitle.innerText = "Damn! It's a tie!";
  } else if (
    (userHand === 0 && (compHand === 2 || compHand === 3)) ||
    (userHand === 1 && (compHand === 0 || compHand === 4)) ||
    (userHand === 2 && (compHand === 1 || compHand === 3)) ||
    (userHand === 3 && (compHand === 1 || compHand === 4)) ||
    (userHand === 4 && (compHand === 0 || compHand === 2))
  ) {
    displayResultTitle.innerText = `You win! ${hands[userHand]} beats ${hands[compHand]}  👍`;
    incrementScorePlayer();
  } else if (userHand === 5) {
    displayResultTitle.innerText = `Oi! You haven't picked a hand! Pity, but you loose anyway!  👎`;
    incrementScoreSheldon();
  } else {
    displayResultTitle.innerText = `Ups! Bad Luck! ${hands[compHand]} beats ${hands[userHand]}  👎`;
    incrementScoreSheldon();
  }

  //The condition that checks the maximum number of rounds and returns Player to a new round or to the intro screen
  if (currentRoundCount <= 3) {
    /**
     * Delays 10sec change of screen to the new round if player fails to click to return
     */
    timeoutReturn = setTimeout(function () {
      displayPlayground();
    }, 5000);

    /**
     * Upon the click the event returns player to the new round screen, clears timeout
     * To avoid bugs these listeners require remove method when the new game begins and scores are cleared
     */
    displayResultDiv.addEventListener("click", clearTimeNewRound);
  } else {
    /**
     * Delays 10sec change of screen to the intro page when the max number of rounds has been reached
     * if player fails to click to return
     */
    timeoutReturn = setTimeout(function () {
      displayIntro();
      lastGameResults();
    }, 5000);

    /**
     * Upon the click the event returns player to the new round screen, when the max number of rounds
     * has been reached, clears timeout.
     * To avoid bugs these listeners require remove method when the new game begins and scores are cleared
     */
    displayResultDiv.addEventListener("click", clearTimeIntroResults);
  }
}

/**
 * this function is registered mainly in order to be able to remove the listener
 */
function clearTimeNewRound() {
  clearTimeout(timeoutReturn);
  displayPlayground();
}

/**
 * this function is registered mainly in order to be able to remove the listener
 */
function clearTimeIntroResults() {
  clearTimeout(timeoutReturn);
  displayIntro();
  lastGameResults();
}

/**
 * Increments the Player's score
 */
function incrementScorePlayer() {
  let oldScorePlayer = parseInt(footerYouScore.innerText);
  footerYouScore.innerText = ++oldScorePlayer;
}

/**
 * Increments the Computer's score
 */
function incrementScoreSheldon() {
  let oldScoreSheldon = parseInt(footerSheldonScore.innerText);
  footerSheldonScore.innerText = ++oldScoreSheldon;
}

/**
 * Increments the number of rounds played
 */
function incrementRoundCount() {
  // let oldCount = parseInt(footerRoundCount.innerText);
  footerRoundCount.innerText = ++currentRoundCount;
}

/**
 * Clears all scores to start a new round and assigns the initial text to the footer title
 */
function clearScores() {
  footerRoundCount.innerText = 0;
  footerSheldonScore.innerText = 0;
  footerYouScore.innerText = 0;
  currentRoundCount = 0;
  footerItemTitle.innerText = `Maximum Number Of Rounds Per Game = 10`;
}

/**
 * Displays messages to the intro screen Footer about a Winner or a tie after the game has ended,
 * i.e. the maximum number of rounds has been played
 */
function lastGameResults() {
  let lastScorePlayer = parseInt(footerYouScore.innerText);
  let lastScoreSheldon = parseInt(footerSheldonScore.innerText);
  if (lastScoreSheldon > lastScorePlayer) {
    footerItemTitle.innerText = `Regret to say but You lost the last game: ${lastScorePlayer} to ${lastScoreSheldon} 🥱`;
  } else if (lastScoreSheldon < lastScorePlayer) {
    footerItemTitle.innerText = `What can I say, You won the last game: ${lastScorePlayer} to ${lastScoreSheldon} 🤥`;
  } else {
    footerItemTitle.innerText = `Miraculously, You managed to tie with me! 🤔`;
  }
}
