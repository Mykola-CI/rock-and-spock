// Setting event listener on the DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Arranging visibility of DOM elements on the first (landing) screen
  displaySection("intro");
  hideSection("playground");
  hideSection("clock-countdown");
  hideSection("display-result");
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
    hideSection("display-result");
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
const handButtons = document.querySelectorAll(".hand-type--button");
const startRoundBtn = document.getElementById("start-control--button");
let timeoutID;

// Setting event listener for the only button on the Playground screen
startRoundBtn.addEventListener("click", function () {

  // Change the Playground screen to display 5 hands and clock-ticking
  hideSection("intro");
  hideSection("playground");
  displaySection("clock-countdown");
  hideSection("display-result");
  displaySection("hand-selection");
  hideSection("footer--score");
  hideSection("footer--round-count");

  timeoutID = setTimeout(function () {
    hideSection("clock-countdown");
    hideSection("hand-selection");
    displaySection("display-result");
    defineWinner(5);
  }, 3000);

  handButtons.forEach((handButton) => {
    handButton.addEventListener("click", handClickHandler);
  });
});

function handClickHandler(event) {
  const clickedHandId = event.currentTarget.id;
  clearTimeout(timeoutID);
  hideSection("clock-countdown");
  displaySection("display-result");
  console.log("this is the test for retrieving id: " + clickedHandId); // console
  const indexUser = hands.indexOf(clickedHandId);
  defineWinner(indexUser);
}

function removeHandEventListeners() {
  handButtons.forEach(handButton => {
    handButton.removeEventListener('click', handClickHandler);
  });
}

function defineWinner(userHand) {
  
  let indexComp = Math.floor(Math.random() * 5);


  for (let index = 0; index < hands.length; index++) {
    if (index !== userHand && index !== indexComp) {
      hideSection(hands[index]);
    }
  }

  if (indexComp === userHand) {
    document.getElementById("display-result--title").innerText = "Damn! It's a tie!";
    console.log("Damn it! It's a tie!"); // Console
  } else if (
    (userHand === 0 && (indexComp === 2 || indexComp === 3)) ||
    (userHand === 1 && (indexComp === 0 || indexComp === 4)) ||
    (userHand === 2 && (indexComp === 1 || indexComp === 3)) ||
    (userHand === 3 && (indexComp === 1 || indexComp === 4)) ||
    (userHand === 4 && (indexComp === 0 || indexComp === 2))
  ) {
    document.getElementById("display-result--title").innerText = `You win! ${hands[userHand]} beats ${hands[indexComp]}`;
  } else if (userHand === 5) {
    document.getElementById("display-result--title").innerText = `Oi! You haven't picked a hand! Pity, but you loose anyway!`;
  } else {
    document.getElementById("display-result--title").innerText = `Ups! Bad Luck! ${hands[indexComp]} beats ${hands[userHand]}`;
  }

  removeHandEventListeners();
}
