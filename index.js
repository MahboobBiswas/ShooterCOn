"use strict";

let round = document.getElementById("round");
const message = document.getElementById("message");
const overlay = document.getElementById("overlay");
const startGame = document.getElementById("start_game");
const player_1_healthLevel = document.getElementById(`player_1_health`);
const player_2_healthLevel = document.getElementById(`player_2_health`);
const player_1_currentScore = document.getElementById(`player_1_score`);
const player_2_currentScore = document.getElementById(`player_2_score`);

let currentRound = 1;
let player_1_score = 0;
let player_2_score = 0;
let player_1_health = 100;
let player_2_health = 100;

startGame.addEventListener("click", () => {
  overlay.style.top = "100vh";

  document.addEventListener("keypress", handleKeyPress);
});

// handle key press
function handleKeyPress(e) {
  if (e.key == "s") {
    shoot(1);
  } else if (e.key == 5) {
    shoot(2);
  }
}

// shoot
function shoot(player) {
  const body = document.querySelector("body");
  const gun = document.querySelector(`.player_${player}`);
  const bullet = document.createElement("div");
  bullet.className = `player_${player}_bullet`;
  gun.appendChild(bullet);

  const deviceWidth = body.clientWidth - 120;
  player == 1
    ? (bullet.style.left = deviceWidth + "px")
    : (bullet.style.right = deviceWidth + "px");

  let calledIf,
    calledElseIf = false;
  const interval = setInterval(() => {
    const coord = bullet.getBoundingClientRect();
    if (player == 1 && !calledIf && Math.ceil(coord.right) >= deviceWidth) {
      decreaseHealth(2, randomPower(1, 5));
      calledIf = true;
    } else if (
      player == 2 &&
      !calledElseIf &&
      Math.floor(coord.left) <= gun.clientWidth
    ) {
      decreaseHealth(1, randomPower(1, 5));
      calledElseIf = true;
    }
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    player == 1
      ? (bullet.style.left = "-24px")
      : (bullet.style.right = "-24px");
    bullet.style.opacity = 0;
    setTimeout(() => {
      bullet.style.opacity = 1;
    }, 1600);
  }, 1600);
}

// decrease health
function decreaseHealth(player, damage) {
  if (player == 1 && player_1_health >= 0) {
    player_1_health -= damage;
    player_1_healthLevel.style.height = player_1_health + "%";

    if (player_1_health <= 0) {
      player_1_healthLevel.style.height = 0 + "%";
      setPlayerScore(2);
      resetHealth();
      setCount();
    }
  } else if (player == 2 && player_2_health >= 0) {
    player_2_health -= damage;
    player_2_healthLevel.style.height = player_2_health + "%";

    if (player_2_health <= 0) {
      player_2_healthLevel.style.height = 0 + "%";
      setPlayerScore(1);
      resetHealth();
      setCount();
    }
  }
}

// set score
function setPlayerScore(player) {
  const score = player == 1 ? (player_1_score += 1) : (player_2_score += 1);
  const playerScore =
    player == 1 ? player_1_currentScore : player_2_currentScore;
  playerScore.innerText = score;
  if (score == 3) {
    message.innerHTML = `<h1>Player ${player} is winner!</h1><button onclick="restartGame()">Restart Game</button>`;
    // remove event listener
    document.removeEventListener("keypress", handleKeyPress);
  }
}

// reset health
function resetHealth() {
  player_1_health = 100;
  player_2_health = 100;
  player_1_healthLevel.style.height = "100%";
  player_2_healthLevel.style.height = "100%";
}

// restart game
function restartGame() {
  message.innerHTML = `<h1>Round <span id="round">1</span>/5.</h1><p><b>Player 1: </b> Click "S" to shoot.</p><p><b>Player 2: </b> Click "5" to shoot.</p>`;

  resetHealth();
  currentRound = 1;
  round = document.getElementById("round");
  player_1_score = 0;
  player_2_score = 0;
  player_1_currentScore.innerText = 0;
  player_2_currentScore.innerText = 0;
  document.addEventListener("keypress", handleKeyPress);
}

// set count
function setCount() {
  currentRound += 1;
  round.innerText = currentRound;

  if (currentRound == 5 && player_1_score == player_2_score) {
    message.innerHTML = `<h1>Game over, play again!</h1><h1>Round 5/5.</h1><h1>It's Draw.</h1><button onclick="restartGame()">Restart Game</button>`;
    // remove event listener
    document.removeEventListener("keypress", handleKeyPress);
  } else if (currentRound == 5) {
    message.innerHTML = `<h1>Game over, play again!</h1><h1>Round 5/5.</h1><button onclick="restartGame()">Restart Game</button>`;
    // remove event listener
    document.removeEventListener("keypress", handleKeyPress);
  }
}

// random power
function randomPower(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}
