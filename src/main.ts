import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
} from "pixi.js";
import {
  CACTUS_CONSTANTS,
  CAT_CONSTANTS,
  COUNTER_CONSTANTS,
  GAME_OVER_CONSTANTS,
} from "./constants";

async function startGame() {
  const app = new Application();

  Assets.addBundle("images", {
    cat: "/images/cat.png",
    cactus: "/images/cactus.png",
  });

  await Assets.loadBundle(["images"]);

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

  let cat: Sprite;
  let cactus: Sprite;
  let jumpCounter = 0;
  let gameOver = false;
  let isJumping = false;
  let jumpVelocity = 0;
  let gravity = 0.5;
  let jumpStrength = -15;
  let cactusSpeed = CACTUS_CONSTANTS.cactus.speed;

  let jumpCounterText = new Text({
    text: `SCORE : ${jumpCounter}`,
    style: COUNTER_CONSTANTS.text_style,
  });

  const restart = new Text({
    text: `RESTART`,
    style: GAME_OVER_CONSTANTS.restart_text_style,
  });

  function drawCat() {
    cat = new Sprite(Assets.get("cat"));
    cat.width = CAT_CONSTANTS.cat.width;
    cat.height = CAT_CONSTANTS.cat.height;

    catContainer.position.set(
      CAT_CONSTANTS.container.x,
      CAT_CONSTANTS.container.y
    );

    catContainer.addChild(cat);
    app.stage.addChild(catContainer);
  }

  function drawCactus() {
    cactus = new Sprite(Assets.get("cactus"));
    cactus.width = CACTUS_CONSTANTS.cactus.width;
    cactus.height = CACTUS_CONSTANTS.cactus.height;

    cactusContainer.position.set(
      CACTUS_CONSTANTS.container.x,
      CACTUS_CONSTANTS.container.y
    );

    cactusContainer.addChild(cactus);
    app.stage.addChild(cactusContainer);
  }

  function drawCounter() {
    counterContainer.addChild(jumpCounterText);
    counterContainer.position.set(
      COUNTER_CONSTANTS.container.x,
      COUNTER_CONSTANTS.container.y
    );
    app.stage.addChild(counterContainer);
  }

  function drawGameOverPopUp() {
    const bg = new Graphics().rect(0, 0, 500, 250).fill(0xff0000);

    const gameOverText = new Text({
      text: `GAME OVER YOUR SCORE: ${jumpCounter}`,
      style: GAME_OVER_CONSTANTS.game_over_text_style,
    });
    gameOverText.anchor.set(0.5);
    restart.anchor.set(0.5);

    gameOverText.position.set(
      GAME_OVER_CONSTANTS.game_over_text_position.x,
      GAME_OVER_CONSTANTS.game_over_text_position.y
    );

    restart.position.set(
      GAME_OVER_CONSTANTS.restar_text_position.x,
      GAME_OVER_CONSTANTS.restar_text_position.y
    );

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

      if (catContainer.y >= CAT_CONSTANTS.container.y) {
        catContainer.y = CAT_CONSTANTS.container.y;
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
    cactusContainer.x = CACTUS_CONSTANTS.container.x;
    catContainer.y = CAT_CONSTANTS.container.y;
    cactusSpeed = CACTUS_CONSTANTS.cactus.speed;
    gameOver = false;
    isJumping = false;
    jumpVelocity = 0;
    jumpCounter = 0;
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
  // window.addEventListener
  // restart.addEventListener
}

startGame();
