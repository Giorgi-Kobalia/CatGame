import { Application, Container, Graphics, Text } from "pixi.js";

const app = new Application();
await app.init({
  width: 1600,
  height: 800,
  backgroundColor: 0x87ceeb,
  antialias: true,
});

const gameScene = document.getElementById("app");
gameScene?.appendChild(app.canvas);

(globalThis as any).__PIXI_APP__ = app;
const catContainer = new Container();
const cactusContainer = new Container();
const counterContainer = new Container();
const gameOverContainer = new Container();

let cat: Graphics;
let cactus: Graphics;
let jumpCounter = 0;
let cactusSpeed = 10;
let gameOver = false;
let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.5;
const jumpStrength = -15;

let jumpCounterText = new Text({
  text: `SCORE : ${jumpCounter}`,
  style: {
    fontFamily: "Arial",
    fontSize: 36,
    fill: "black",
  },
});

const restart = new Text({
  text: `RESTART`,
  style: {
    fontFamily: "Arial",
    fontSize: 56,
    fill: "black",
  },
});

function drawCat() {
  cat = new Graphics().rect(0, 0, 100, 200).fill(0xff0000);
  catContainer.addChild(cat);
  catContainer.position.set(150, 400);
  app.stage.addChild(catContainer);
}

function drawCactus() {
  cactus = new Graphics().rect(0, 0, 200, 100).fill(0xff0000);
  cactusContainer.addChild(cactus);
  cactusContainer.position.set(1300, 500);
  app.stage.addChild(cactusContainer);
}

function drawCounter() {
  counterContainer.addChild(jumpCounterText);
  counterContainer.position.set(700, 240);
  app.stage.addChild(counterContainer);
}

function drawGameOverPopUp() {
  const bg = new Graphics().rect(0, 0, 500, 250).fill(0xff0000);

  const gameOverText = new Text({
    text: `GAME OVER YOUR SCORE: ${jumpCounter}`,
    style: {
      fontFamily: "Arial",
      fontSize: 44,
      fill: "black",
      wordWrap: true,
      wordWrapWidth: 400,
      align: "center",
    },
  });

  gameOverText.anchor.set(0.5);
  gameOverText.position.set(bg.width / 2, bg.height / 3);

  restart.anchor.set(0.5);
  restart.position.set(bg.width / 2, 200);
  restart.eventMode = "dynamic";

  gameOverContainer.addChild(bg, gameOverText, restart);
  gameOverContainer.pivot.set(
    gameOverContainer.width / 2,
    gameOverContainer.height / 2
  );

  gameOverContainer.position.set(app.canvas.width / 2, app.canvas.height / 2);
  app.stage.addChild(gameOverContainer);
}

function updateCounter() {
  jumpCounter++;
  jumpCounterText.text = `SCORE : ${jumpCounter}`;
  if (jumpCounter && jumpCounter % 10 === 0) {
    cactusSpeed *= 1.5;
  }
}

function checkCollision() {
  const catBounds = cat.getBounds();
  const cactusBounds = cactus.getBounds();
  return (
    catBounds.x + catBounds.width > cactusBounds.x &&
    catBounds.x < cactusBounds.x + cactusBounds.width &&
    catBounds.y + catBounds.height > cactusBounds.y &&
    catBounds.y < cactusBounds.y + cactusBounds.height
  );
}

function moveCactus() {
  if (gameOver) return;

  cactusContainer.x -= cactusSpeed;

  if (cactusContainer.x + cactusContainer.width < 0) {
    cactusContainer.x = app.canvas.width;
    updateCounter();
  }

  if (checkCollision()) {
    gameOver = true;
    drawGameOverPopUp();
    // app.ticker.stop();
  }
}

function handleJump() {
  if (!isJumping) {
    isJumping = true;
    jumpVelocity = jumpStrength;
  }
}

function applyJumpPhysics() {
  if (isJumping) {
    catContainer.y += jumpVelocity;
    jumpVelocity += gravity;

    if (catContainer.y >= 400) {
      catContainer.y = 400;
      isJumping = false;
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") handleJump();
});

restart.addEventListener("click", () => {
  resetGame();
});

app.ticker.add(() => {
  moveCactus();
  applyJumpPhysics();
});

function resetGame() {
  cactusSpeed = 10;
  jumpCounter = 0;
  cactusContainer.x = 1300;
  catContainer.y = 400;
  gameOver = false;
  isJumping = false;
  jumpVelocity = 0;
  jumpCounterText.text = `SCORE : ${jumpCounter}`;
  gameOverContainer.removeChildren();
  app.ticker.start();
}

drawCat();
drawCactus();
drawCounter();

// app.stage;
// catContainer;
// cactusContainer;
// counterContainer;
