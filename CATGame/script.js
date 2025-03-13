alert(
  "Hello! Game will start automatically. For jumping press the mouse left button"
);

var character = document.getElementById("cat");
var block = document.getElementById("branch");
let blockPosition = 1600;
console.log(window.innerWidth);

let blockSpeed = 15;
let x = 0;
let GameOver = false;

function jump() {
  if (character.classList.contains("animate")) return;
  character.classList.add("animate");

  setTimeout(function () {
    character.classList.remove("animate");
  }, 1000);

  countJumps();
}

function countJumps() {
  x += 1;
  updateCounter();
}

function updateCounter() {
  var counter = document.getElementById("jumps");
  counter.innerHTML = `Jumps Amount = ${x}`;
}

function checkCollision() {
  var characterRect = character.getBoundingClientRect();
  var blockRect = block.getBoundingClientRect();

  const shrinkAmount = 10;
  characterRect = {
    top: characterRect.top + shrinkAmount,
    bottom: characterRect.bottom + shrinkAmount,
    left: characterRect.left + shrinkAmount * 2,
    right: characterRect.right - shrinkAmount,
    width: characterRect.width - shrinkAmount * 4,
    height: characterRect.height - shrinkAmount * 2,
  };

  if (
    characterRect.left < blockRect.right &&
    characterRect.right > blockRect.left &&
    characterRect.top < blockRect.bottom &&
    characterRect.bottom > blockRect.top
  ) {
    GameOver = true;
    alert("Game Over!");
    location.reload();
  }
}

const gameLoop = () => {
  if (!GameOver) {
    // Move the bush
    blockPosition -= blockSpeed;

    // Reset position when it goes off-screen
    if (blockPosition < -block.offsetWidth) {
      blockPosition = 1600;
    }

    block.style.transform = `translateX(${blockPosition}px)`;

    checkCollision();
    requestAnimationFrame(gameLoop);
  }
};

// Start the game after alert is dismissed
gameLoop();
