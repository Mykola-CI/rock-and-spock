let soundEnabled;

/**
 * Setting event listener on the Window load to display intro screen
 * and provide for full functionality
 * */
window.onload = (event) => {
  displaySectionClass(".display-intro");
  hideSectionClass(".hide-intro");

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
    displaySectionClass(".display-playground");
    hideSectionClass(".hide-playground");
    let lastRoundCount = parseInt(document.querySelector("#footer--round-count>h3").innerText);
    if (lastRoundCount > 3) {
      clearScores();
    }
  });
};

const hands = ["rock", "paper", "scissors", "lizard", "spock"]; // Array that consists of strings - id selectors of 5 available gaming hands
const handButtons = document.querySelectorAll(".hand-type--button");
const startRoundBtn = document.getElementById("start-control");
const audioClick = new Audio("assets/sounds/421251__jaszunio15__click_121.wav");
const audioPick = new Audio("assets/sounds/28828__junggle__btn018.wav");
const countdownDisplays = document.querySelectorAll(".countdown-numbers");
let currentRoundCount;
let timeoutID;
let timeoutReturn;
let countdownValue;
let countdownInterval;

const soundToggleButtons = document.getElementsByClassName("sound-toggle");

for (let icon of soundToggleButtons) {
  icon.addEventListener("click", toggleSound)
}

const headers = document.querySelector("header");
/**
 * Listens to the click inside the header area to return the player to the Intro screen
 */
headers.addEventListener("click", function () {
  displaySectionClass(".display-intro");
  hideSectionClass(".hide-intro");
});

const footerRoundCount = document.querySelector("#footer--round-count>h3");
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

  currentRoundCount = parseInt(footerRoundCount.innerText);

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
      countdownDisplays.forEach((display) => (display.innerText = ""));
    } else {
      countdownDisplays.forEach((display) => (display.innerText = countdownValue));
    }
  }, 1000);

  /**
   * Sets the delay time 5sec for the function defineWinner to implement
   * in case the Player fails to select the hand within 5 sec
   */
  timeoutID = setTimeout(function () {
    hideSection("clock-countdown");
    hideSection("hand-selection");
    displaySection("display-result");
    defineWinner(5);
  }, 5000);

  /**
   * On click event launches the handClickHandler function, which deals with the selected hand
   */
  handButtons.forEach((handButton) => {
    handButton.addEventListener("click", handClickHandler);
  });
});

function toggleSound() {
  soundEnabled = !soundEnabled;
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
 * Rearranges the screen to reveal result and clears timeout
 * to prevent defineWinner function run the second time
 */
function handClickHandler(event) {
  if (soundEnabled) {
    audioPick.play();
  }
  const clickedHandId = event.currentTarget.id;
  clearTimeout(timeoutID);
  clearInterval(countdownInterval);
  countdownDisplays.forEach((display) => (display.innerText = ""));
  hideSection("clock-countdown");
  displaySection("display-result");
  const indexUser = hands.indexOf(clickedHandId);
  defineWinner(indexUser);
  removeEventListeners(handButtons);
}

/**
 * Remove event listeners for 5 hand buttons after
 * the round has been finished and Winner defined. The goal is
 * to prevent from triggering of multiple code running on accidental clicks
 */
function removeEventListeners(items) {
  items.forEach((button) => {
    button.removeEventListener("click", handClickHandler);
  });
}

/**
 * Major function that randomly generates computer's hand.
 * Executes the logic of defining the winner and display the result messages
 */
function defineWinner(userHand) {
  let indexComp = Math.floor(Math.random() * 5);

  // This loop hides inactive hands left after Player and Computer have picked theirs
  for (let index = 0; index < hands.length; index++) {
    if (index !== userHand && index !== indexComp) {
      hideSection(hands[index]);
    }
  }

  // This condition defines Winner for the round and handles scores
  if (indexComp === userHand) {
    displayResultTitle.innerText = "Damn! It's a tie!";
  } else if (
    (userHand === 0 && (indexComp === 2 || indexComp === 3)) ||
    (userHand === 1 && (indexComp === 0 || indexComp === 4)) ||
    (userHand === 2 && (indexComp === 1 || indexComp === 3)) ||
    (userHand === 3 && (indexComp === 1 || indexComp === 4)) ||
    (userHand === 4 && (indexComp === 0 || indexComp === 2))
  ) {
    displayResultTitle.innerText = `You win! ${hands[userHand]} beats ${hands[indexComp]}  👍`;
    incrementScorePlayer();
  } else if (userHand === 5) {
    displayResultTitle.innerText = `Oi! You haven't picked a hand! Pity, but you loose anyway!  👎`;
    incrementScoreSheldon();
  } else {
    displayResultTitle.innerText = `Ups! Bad Luck! ${hands[indexComp]} beats ${hands[userHand]}  👎`;
    incrementScoreSheldon();
  }

  

  let displayResultDiv = document.getElementById("display-result");

  //The condition that checks the maximum number of rounds and returns Player to a new round or to the intro screen
  if (currentRoundCount <= 3) {
    /**
     * Delays 10sec change of screen to the new round if player fails to click to return
     */
    timeoutReturn = setTimeout(function () {
      displaySectionClass(".display-playground");
      hideSectionClass(".hide-playground");
    }, 10000);
    /**
     * Upon the click event returns player to the new round screen, clears timeout
     */
    displayResultDiv.addEventListener("click", function () {
      clearTimeout(timeoutReturn);
      displaySectionClass(".display-playground");
      hideSectionClass(".hide-playground");
    });
  } else {
    /**
     * Delays 10sec change of screen to the intro page when the max number of rounds has been reached
     * if player fails to click to return
     */
    timeoutReturn = setTimeout(function () {
      displaySectionClass(".display-intro");
      hideSectionClass(".hide-intro");
      lastGameResults();
    }, 10000);
    /**
     * Upon the click event returns player to the new round screen, when the max number of rounds
     * has been reached, clears timeout
     */
    displayResultDiv.addEventListener("click", function () {
      clearTimeout(timeoutReturn);
      displaySectionClass(".display-intro");
      hideSectionClass(".hide-intro");
      lastGameResults();
    });
  }
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
  let oldCount = parseInt(footerRoundCount.innerText);
  footerRoundCount.innerText = ++oldCount;
}

/**
 * Clears all scores to start a new round and assigns the initial text to the footer title
 */
function clearScores() {
  footerRoundCount.innerText = 0;
  footerSheldonScore.innerText = 0;
  footerYouScore.innerText = 0;
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
