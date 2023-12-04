// Setting event listener on the DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Arranging visibility of DOM elements on the first (landing) screen
  displaySection("intro");
  hideSection("playground");
  hideSection("clock-countdown");
  hideSection("hand-selection");
  hideSection("footer--score");
  hideSection("footer--round-count");

  const goPlaygroundButton = document.getElementById("start-playground--button");

  // Setting event listener for the only button on the intro screen
  goPlaygroundButton.addEventListener("click", function () {
    // Change the the Intro screen to the Playground one
    hideSection("intro");
    displaySection("playground");
    hideSection("clock-countdown");
    hideSection("hand-selection");
    hideSection("footer--score");
    hideSection("footer--round-count");
  });
});

/**
 * Function hiding the section with the specified id
 */
function hideSection(id) {
  const hideElement = document.getElementById(id);
  hideElement.classList.add("hidden");
}

/**
 * Function displaying the section with the specified id
 */
function displaySection(id) {
  const displayElement = document.getElementById(id);
  displayElement.classList.remove("hidden");
}

// Array that consists of strings - id selectors of 5 available gaming hands
const hands = ["rock", "paper", "scissors", "lizard", "spock"];

const startRoundBtn = document.getElementById("start-control--button");

// Setting event listener for the only button on the Playground screen
startRoundBtn.addEventListener("click", function () {
  // Change the Playground screen to display 5 hands and clock-ticking
  hideSection("intro");
  hideSection("playground");
  displaySection("clock-countdown");
  displaySection("hand-selection");
  hideSection("footer--score");
  hideSection("footer--round-count");

  let indexComp = getComputerHand();
  console.log("This is Computers choice: " + indexComp); // Console

  let timeoutID = setTimeout(function () {
    indexUser = 5;
    console.log(indexComp + ": nobody seems to have picked the hand"); // Console
    defineWinner(indexComp, indexUser);
  }, 3000);

  hands.forEach((hand, indexUser) => {
    document.getElementById(hand).addEventListener("click", function () {
      clearTimeout(timeoutID);
      console.log("This is User's choice: " + hand); // Console
      console.log("This is User's index: " + indexUser); // Console
      defineWinner(indexComp, indexUser);
    });
  });
});

function getComputerHand() {
  return Math.floor(Math.random() * 5);
}

function defineWinner(compHand, userHand) {
  console.log("This is what happened:"); // Console
  console.log(compHand + "_versus_" + userHand); // Console

  if (compHand === userHand) {
    console.log("Damn it! It's a tie!"); // Console
  } else if (
    (userHand === 0 && (compHand === 2 || compHand === 3)) ||
    (userHand === 1 && (compHand === 0 || compHand === 4)) ||
    (userHand === 2 && (compHand === 1 || compHand === 3)) ||
    (userHand === 3 && (compHand === 1 || compHand === 4)) ||
    (userHand === 4 && (compHand === 0 || compHand === 2))
  ) {
    console.log(`You win! ${hands[userHand]} beats ${hands[compHand]}`); // Console
  } else if (userHand === 5) {
    console.log(`Oi! You haven't picked a hand! Pity, but you loose anyway!`); // Console
  } else {
    console.log(`Ups! Bad Luck! ${hands[compHand]} beats ${hands[userHand]}`); // Console
  }
}
