const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var maze = sessionStorage.getItem("maze");
var fase = document.getElementById("fase");
var tempoRest = document.getElementById("tempo");
var win = document.querySelector(".win");
var pont = document.querySelector(".pontuacao");
var lose = document.querySelector(".lose");
var next = document.querySelector(".next");
var char = "🏃";

const tileSize = 25;

canvas.height = tileSize * 22;
canvas.width = tileSize * 20;

let tempo = 60;
let timer;

function startTimer() {
  tempo = 60;
  timer = setInterval(function () {
    tempo--;
    tempoRest.innerText = "Tempo: " + tempo;
    if (tempo < 0) {
      tempo = 0;
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

const player = {
  x: canvas.width - tileSize,
  y: canvas.height - tileSize * 5,
  radius: tileSize / 4,
  prevPos: {},
};

let animation;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
const map = mazes[maze ? maze : 0];

var tiles = [];
for (var i = 0; i < map.length; i++) {
  tiles[i] = [];
  for (var j = 0; j < map[i].length; j++) {
    tiles[i][j] = { x: 0, y: 0, type: "" };
  }
}

function drawBoard() {
  ctx.fillStyle = "#03011f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMaze() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      let tileX = j * tileSize;
      let tileY = i * tileSize;
      tiles[i][j].x = tileX;
      tiles[i][j].y = tileY;
      if (map[i][j] === 1) {
        tiles[i][j].type = "wall";
        drawWall(tileX, tileY);
      } else {
        drawEmpty(tileX, tileY);
      }
    }
  }
}

function drawWall(x, y) {
  ctx.fillStyle = "#6cacc5";
  ctx.fillRect(x, y, tileSize, tileSize);
}

function drawEmpty(x, y) {
  ctx.fillStyle = "#03011f";
  ctx.fillRect(x, y, tileSize, tileSize);
}

function drawPlayer() {
  ctx.font = "20px monospaced";
  ctx.fillText(char, player.x + tileSize / 20, player.y + tileSize / 2 + 7);
}

function updatePosition() {
  player.prevPos = { x: player.x, y: player.y };
  if (rightPressed) {
    player.x += 2;
  }
  if (leftPressed) {
    player.x -= 2;
  }
  if (upPressed) {
    player.y -= 2;
  }
  if (downPressed) {
    player.y += 2;
  }
}

function checkCollision() {
  if (player.x + tileSize > canvas.width) {
    player.x = player.prevPos.x;
  }
  if (player.y + player.radius < 0 || player.x + player.radius < 0) {
    if (maze > 2) {
      cancelAnimationFrame(animation);
      gameWin();
    } else {
      showNext();
    }
  }
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      var b = tiles[i][j];
      if (
        player.x + player.radius * 3 > b.x &&
        player.x < b.x + tileSize - player.radius &&
        player.y + tileSize > b.y + player.radius &&
        player.y < b.y + tileSize - player.radius &&
        b.type === "wall"
      ) {
        player.x = player.prevPos.x;
        player.y = player.prevPos.y;
      }
    }
  }
}

function gameWin() {
  clearInterval(timer);
  canvas.style.visibility = "hidden";
  win.style.visibility = "visible";
  pont.style.visibility = "hidden";
  sessionStorage.clear();
}

function gameOver() {
  clearInterval(timer);
  canvas.style.visibility = "hidden";
  lose.style.visibility = "visible";
  pont.style.visibility = "hidden";
  sessionStorage.clear();
}

function nextMaze() {
  clearInterval(timer);
  next.style.visibility = "hidden";
  sessionStorage.setItem("maze", Number(maze) + 1);
  window.location.reload();
}

function showNext() {
  clearInterval(timer);
  canvas.style.visibility = "hidden";
  next.style.visibility = "visible";
  pont.style.visibility = "hidden";
}

document.addEventListener("keydown", function (e) {
  if (e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 38) {
    upPressed = true;
  } else if (e.keyCode === 40) {
    downPressed = true;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 37) {
    leftPressed = false;
  } else if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 38) {
    upPressed = false;
  } else if (e.keyCode === 40) {
    downPressed = false;
  }
});

function update() {
  updatePosition();
  drawBoard();
  drawMaze();

  drawPlayer();
  checkCollision();
  animation = requestAnimationFrame(update);
  fase.innerText = "Fase: " + (Number(maze) + 1);
}

animation = requestAnimationFrame(update);
startTimer();
