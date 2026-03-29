const obstacle = document.querySelector(".obstacle");
const block = document.querySelector(".block");
const hole = document.querySelector(".hole");
const character = document.getElementById("character");

let jumping = false;
let score = 0;

hole.addEventListener("animationiteration", () => {
    const randomTop = Math.floor(Math.random() * 250) + 100;
    hole.style.top = randomTop + "px";

    // Randomize block image
    const images = [
        '../photos/GarinFraley.png',
        '../photos/touchingED1.png',
        '../photos/touchingED2.png',
        '../photos/touchingED3.png'
    ];
    block.style.backgroundImage = `url(${images[Math.floor(Math.random() * images.length)]})`;

    score++;
});

setInterval(() => {
    const charRect = character.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const holeRect = hole.getBoundingClientRect();

    // Gravity
    if (!jumping) {
        character.style.top = (character.offsetTop + 3) + "px";
    }

    // Collision detection
    const touchingObstacle =
        charRect.right > blockRect.left &&
        charRect.left < blockRect.right;

    const outsideHole =
        charRect.top < holeRect.top ||
        charRect.bottom > holeRect.bottom;

    if (touchingObstacle && outsideHole) {
        alert("Game Over! Score: " + score);
        character.style.top = "100px";
        score = 0;
    }

    // Floor death
    if (character.offsetTop > 460) {
        alert("Game Over! Score: " + score);
        character.style.top = "100px";
        score = 0;
    }

}, 10);

function jump() {
    jumping = true;
    let count = 0;

    const jumpInterval = setInterval(() => {
        if (count < 15) {
            character.style.top = (character.offsetTop - 5) + "px";
        } else {
            clearInterval(jumpInterval);
            jumping = false;
        }
        count++;
    }, 10);
}