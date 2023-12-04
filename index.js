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

  let nComp = getComputerHand();
  console.log("This is Computers choice: " + nComp); // Console

  let timeoutID = setTimeout(function () {
    defineWinner(nComp, 6);
    console.log(nComp + ": nobody seems to have picked the hand"); // Console
  }, 3000);

  hands.forEach((hand, index) => {
    document.getElementById(hand).addEventListener("click", function () {
      clearTimeout(timeoutID);

      defineWinner(nComp, index);
      console.log("This is User's choice: " + hand); // Console
      console.log("This is User's index: " + index);  // Console
    });
  });
});

function getComputerHand() {
  return Math.floor(Math.random() * 5);
}

function defineWinner(compHand, userHand) {
  console.log("This is what happened:");
  console.log(compHand + "_versus_" + userHand);
}
