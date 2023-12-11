// Setting event listener on the Window load
window.onload = (event) => {
  displaySectionClass(".display-intro");
  hideSectionClass(".hide-intro");

  const goPlaygroundButton = document.getElementById("start-playground--button");
  const video = document.querySelector("#intro-video>video");
  // Setting event listener for the only button on the intro screen
  goPlaygroundButton.addEventListener("click", function () {
    audioClick.play();
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

// Array that consists of strings - id selectors of 5 available gaming hands
const hands = ["rock", "paper", "scissors", "lizard", "spock"];
const handButtons = document.querySelectorAll(".hand-type--button");
const startRoundBtn = document.querySelectorAll("#start-control");
const audioClick = new Audio("assets/sounds/421251__jaszunio15__click_121.wav");
const audioPick = new Audio("assets/sounds/28828__junggle__btn018.wav");
let currentRoundCount;
let timeoutID;
let timeoutReturn;
let countdownValue;
let countdownInterval;
let countdownDisplays = document.querySelectorAll(".countdown-numbers");

let headers = document.querySelectorAll("header");
headers.forEach((header) => {
  header.addEventListener("click", function () {
    displaySectionClass(".display-intro");
    hideSectionClass(".hide-intro");
  });
});

// Setting event listener for the only button on the Playground screen
startRoundBtn.forEach((starter) => {
  starter.addEventListener("click", function () {
    audioClick.play();
    // Change the Playground screen to display 5 hands and clock-ticking
    displaySectionClass(".display-clock-hands");
    hideSectionClass(".hide-clock-hands");
    incrementRoundCount();

    currentRoundCount = parseInt(document.querySelector("#footer--round-count>h3").innerText);

    // This loop reinstates availability of 'inactive' hands hidden at the previous round
    // - refer to the respective loop in defineWinner function
    for (let index = 0; index < hands.length; index++) {
      displaySection(hands[index]);
    }

    countdownValue = 5;
    countdownDisplays.forEach((display) => (display.innerText = countdownValue));
    countdownInterval = setInterval(function () {
      countdownValue--;
      if (countdownValue < 0) {
        clearInterval(countdownInterval);
        countdownDisplays.forEach((display) => (display.innerText = ""));
      } else {
        countdownDisplays.forEach((display) => (display.innerText = countdownValue));
      }
    }, 1000);

    timeoutID = setTimeout(function () {
      hideSection("clock-countdown");
      hideSection("hand-selection");
      displaySection("display-result");
      defineWinner(5);
    }, 5000);

    handButtons.forEach((handButton) => {
      handButton.addEventListener("click", handClickHandler);
    });
  });
});

/**
 * Function hiding a section with a specified id
 * @param {*} id
 */
function hideSection(id) {
  const hideElement = document.getElementById(id);
  hideElement.classList.add("hidden");
}

/**
 * Function hiding all sections with a specified class name
 * @param {*} id
 */
function hideSectionClass(className) {
  const elements = document.querySelectorAll(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.add("hidden");
  }
}

/**
 * Function displaying a section with a specified id
 * @param {*} id
 */
function displaySection(id) {
  const displayElement = document.getElementById(id);
  displayElement.classList.remove("hidden");
}

/**
 * Function displaying all sections with a specified class name
 * @param {*} id
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
 * @param {*} event
 */
function handClickHandler(event) {
  audioPick.play();
  const clickedHandId = event.currentTarget.id;
  clearTimeout(timeoutID);
  clearInterval(countdownInterval);
  countdownDisplays.forEach((display) => (display.innerText = ""));
  hideSection("clock-countdown");
  displaySection("display-result");
  const indexUser = hands.indexOf(clickedHandId);
  defineWinner(indexUser);
}

/**
 * Remove event listeners for 5 hand buttons after
 * the round has been finished and Winner defined. The goal is
 * to prevent from triggering of multiple code running on accidental clicks
 */
function removeHandEventListeners() {
  handButtons.forEach((handButton) => {
    handButton.removeEventListener("click", handClickHandler);
  });
}

/**
 * Major function that randomly generates computer's hand.
 * Executes the logic of defining the winner and display the result messages
 * @param {*} userHand
 */
function defineWinner(userHand) {
  let indexComp = Math.floor(Math.random() * 5);

  // This loop hides inactive hands left after Player and Computer have picked theirs
  for (let index = 0; index < hands.length; index++) {
    if (index !== userHand && index !== indexComp) {
      hideSection(hands[index]);
    }
  }

  if (indexComp === userHand) {
    document.getElementById("display-result--title").innerText = "Damn! It's a tie!";
  } else if (
    (userHand === 0 && (indexComp === 2 || indexComp === 3)) ||
    (userHand === 1 && (indexComp === 0 || indexComp === 4)) ||
    (userHand === 2 && (indexComp === 1 || indexComp === 3)) ||
    (userHand === 3 && (indexComp === 1 || indexComp === 4)) ||
    (userHand === 4 && (indexComp === 0 || indexComp === 2))
  ) {
    document.getElementById("display-result--title").innerText = `You win! ${hands[userHand]} beats ${hands[indexComp]}  👍`;
    incrementScorePlayer();
  } else if (userHand === 5) {
    document.getElementById("display-result--title").innerText = `Oi! You haven't picked a hand! Pity, but you loose anyway!  👎`;
    incrementScoreSheldon();
  } else {
    document.getElementById(
      "display-result--title"
    ).innerText = `Ups! Bad Luck! ${hands[indexComp]} beats ${hands[userHand]}  👎`;
    incrementScoreSheldon();
  }

  removeHandEventListeners();

  timeoutReturn = setTimeout(function () {
    if (currentRoundCount <= 3) {
      displaySectionClass(".display-playground");
      hideSectionClass(".hide-playground");
    } else {
      displaySectionClass(".display-intro");
      hideSectionClass(".hide-intro");
      lastGameResults();
    }
  }, 10000);

  let displayResultDiv = document.getElementById("display-result");

  displayResultDiv.addEventListener("click", function () {
    clearTimeout(timeoutReturn);
    if (currentRoundCount <= 3) {
      displaySectionClass(".display-playground");
      hideSectionClass(".hide-playground");
    } else {
      displaySectionClass(".display-intro");
      hideSectionClass(".hide-intro");
      lastGameResults();
    }
  });
}

function incrementScorePlayer() {
  let oldScorePlayer = parseInt(document.querySelector("#footer--you-score>h3").innerText);
  // lastScorePlayer = oldScorePlayer + 1;
  // console.log("Score Player = " + lastScorePlayer);
  // document.querySelector("#footer--sheldon-score>h3").innerText = lastScorePlayer;
  document.querySelector("#footer--you-score>h3").innerText = ++oldScorePlayer;
}

function incrementScoreSheldon() {
  let oldScoreSheldon = parseInt(document.querySelector("#footer--sheldon-score>h3").innerText);
  // lastScoreSheldon = oldScoreSheldon + 1;
  // console.log("Score Sheldon = " + lastScoreSheldon);
  // document.querySelector("#footer--sheldon-score>h3").innerText = lastScoreSheldon;
  document.querySelector("#footer--sheldon-score>h3").innerText = ++oldScoreSheldon;
}

function incrementRoundCount() {
  let oldCount = parseInt(document.querySelector("#footer--round-count>h3").innerText);
  document.querySelector("#footer--round-count>h3").innerText = ++oldCount;
}

function clearScores() {
  document.querySelector("#footer--round-count>h3").innerText = 0;
  document.querySelector("#footer--sheldon-score>h3").innerText = 0;
  document.querySelector("#footer--you-score>h3").innerText = 0;
  document.querySelector("#footer--item-title>h3").innerText = `Maximum Number Of Rounds Per Game = 10`;
}

function lastGameResults() {
  let lastScorePlayer = parseInt(document.querySelector("#footer--you-score>h3").innerText);
  let lastScoreSheldon = parseInt(document.querySelector("#footer--sheldon-score>h3").innerText);
  if (lastScoreSheldon > lastScorePlayer) {
    document.querySelector(
      "#footer--item-title>h3"
    ).innerText = `Regret to say but You lost the last game ${lastScorePlayer} to ${lastScoreSheldon} 🥱`;
  } else if (lastScoreSheldon < lastScorePlayer) {
    document.querySelector(
      "#footer--item-title>h3"
    ).innerText = `What can I say, You won the last game ${lastScorePlayer} to ${lastScoreSheldon} 🤥`;
  } else {
    document.querySelector("#footer--item-title>h3").innerText = `Miraculously You managed to tie with me! 🤔`;
  }
}
