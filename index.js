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

});
