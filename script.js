const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var maze = sessionStorage.getItem("maze");
var fase = document.getElementById("fase");

const tileSize = 25;

canvas.height = tileSize * 22;
canvas.width = tileSize * 20;

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
  ctx.fillText("🏃", player.x + tileSize / 3, player.y + tileSize / 1.5);
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
    if (maze > 1) {
      cancelAnimationFrame(animation);
      gameOver();
    } else {
      newMaze();
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

function gameOver() {
  canvas.style.visibility = "hidden";
  var win = document.querySelector(".win");
  win.style.visibility = "visible";
  sessionStorage.clear();
}

function newMaze() {
  sessionStorage.setItem("maze", Number(maze) + 1);
  window.location.reload();
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
