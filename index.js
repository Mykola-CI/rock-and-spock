document.addEventListener("DOMContentLoaded", function () {
  displaySection("intro");
  hideSection("playground");
  hideSection("clock-countdown");
  hideSection("hand-selection");
  hideSection("footer--score");
  hideSection("footer--round-count");

  const goPlaygroundButton = document.getElementById("start-playground--button");

  goPlaygroundButton.addEventListener("click", function () {
    hideSection("intro");
    displaySection("playground");
    hideSection("clock-countdown");
    hideSection("hand-selection");
    hideSection("footer--score");
    hideSection("footer--round-count");
  });
});

function hideSection(id) {
  const hideElement = document.getElementById(id);
  hideElement.classList.add("hidden");
}

function displaySection(id) {
  const displayElement = document.getElementById(id);
  displayElement.classList.remove("hidden");
}

const hands = ["rock", "paper", "scissors", "lizard", "spock"];
const startRoundBtn = document.getElementById("start-control--button");

startRoundBtn.addEventListener("click", function () {
  hideSection("intro");
  hideSection("playground");
  displaySection("clock-countdown");
  displaySection("hand-selection");
  hideSection("footer--score");
  hideSection("footer--round-count");

  let nComp = getComputerHand();
  console.log("This is Computers choice: " + nComp);

  let timeoutID = setTimeout(function () {
    defineWinner(nComp, 6);
    console.log(nComp + ": nobody seems to have picked the hand");
  }, 3000);

  hands.forEach((hand, index) => {
    document.getElementById(hand).addEventListener("click", function () {
      clearTimeout(timeoutID);

      defineWinner(nComp, index);
      console.log("This is User's choice: " + hand);
      console.log("This is User's index: " + index);
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
