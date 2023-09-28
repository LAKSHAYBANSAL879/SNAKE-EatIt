let playboard = document.getElementById("play-board");
let scoreDisplay = document.querySelector(".score");
let hiscorebox = document.querySelector(".hiscore");

let score = 0;
let direction = { x: 0, y: 0 };
let foodSound = new Audio("music/food.mp3");
let gameover = new Audio("music/gameover.mp3");
let moveSound = new Audio("music/move.mp3");
let musicSound = new Audio("music/music.mp3");
let speedx = 0;
let speedy = 0;
let snakebodypos = [];
let snakepos = { x: 8, y: 5 };
let food = { x: 10, y: 12 };

// Retrieve the high score from local storage or set it to 0 if not available
let hiscoreval = localStorage.getItem("hiscore");
if (hiscoreval === null) {
    hiscoreval = 0;
} else {
    hiscoreval = JSON.parse(hiscoreval);
}

// Display the initial high score
hiscorebox.innerHTML = "HiScore: " + hiscoreval;

function changeFood() {
    food.x = Math.floor(Math.random() * 20) + 1;
    food.y = Math.floor(Math.random() * 20) + 1;
}

function changedir(e) {
    musicSound.play();
    if (e.key === "ArrowUp") {
        speedx = -1;
        speedy = 0;
        moveSound.play();
    } else if (e.key === "ArrowDown") {
        speedx = 1;
        speedy = 0;
        moveSound.play();
    } else if (e.key === "ArrowRight") {
        speedx = 0;
        speedy = 1;
        moveSound.play();
    } else if (e.key === "ArrowLeft") {
        speedx = 0;
        speedy = -1;
        moveSound.play();
    }
}

function collide(snakes) {
    if(snakes.length===0){
        return false;
    }
    for (let i = 1; i < snakes.length; i++) {
        if (snakes[i][0] === snakes[0][0] && snakes[i][1] === snakes[0][1]) {
            return true;
        }
    }
    if (snakes[0][0] >= 20 || snakes[0][0] <= 0 || snakes[0][1] >= 20 || snakes[0][1] <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    if (collide(snakebodypos)) {
        gameover.play();
        musicSound.pause();
        alert("Game over! Your score is: " + score);
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscorebox.innerHTML = "HiScore: " + hiscoreval;
        }
        score = 0;
        snakebodypos = [];
        snakepos = { x: 8, y: 5 };
        speedx = 0;
        speedy = 0;
        changeFood();
        musicSound.play();
    }

    let htmlMarkup = '';
    
    // Update the snake's position
    snakepos.x += speedx;
    snakepos.y += speedy;

    // Render the snake's head first
    htmlMarkup += `<div class="head" style="grid-area:${snakepos.x} / ${snakepos.y}"></div>`;

    // Check if the snake has eaten the food
    if (snakepos.x === food.x && snakepos.y === food.y) {
        foodSound.play();
        changeFood();
        snakebodypos.push([food.x, food.y]);
        console.log(snakebodypos);
        score++;
        scoreDisplay.innerHTML = score;
    }

    // Move the snake's body
    for (let i = snakebodypos.length - 1; i > 0; i--) {
        snakebodypos[i] = [...snakebodypos[i - 1]];
    }
    snakebodypos[0] = [snakepos.x, snakepos.y];

    // Render the snake's body
    for (let i = 0; i < snakebodypos.length; i++) {
        htmlMarkup += `<div class="snake" style="grid-area:${snakebodypos[i][0]} / ${snakebodypos[i][1]}"></div>`;
    }

    // Render the food
    htmlMarkup += `<div class="food" style="grid-area:${food.x} / ${food.y}"></div>`;

    playboard.innerHTML = htmlMarkup;
}

document.addEventListener("keydown", changedir);

changeFood();
setInterval(gameEngine, 175);
