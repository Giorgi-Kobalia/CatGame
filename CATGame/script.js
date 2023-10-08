alert ( "Hello! Game will start automatically. For jumping press the mouse left button") ;

var character = document.getElementById("cat")
var block = document.getElementById("branch")

function jump() {
    character.classList.add("animate");

    setTimeout(function() {
        character.classList.remove("animate");
    }, 1000);

    countJumps()
}


var x = 0; 

function countJumps() {
    x += 1;
    updateCounter(); 
}

function updateCounter() {
    var counter = document.getElementById("jumps");
    counter.innerHTML = `Количество прижков  =   ${x} `;
}




var GameOver = false;

function checkCollision() {
    var characterRect = character.getBoundingClientRect();
    var blockRect = block.getBoundingClientRect();

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

function gameLoop() {
    if (!GameOver) {
        checkCollision();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
