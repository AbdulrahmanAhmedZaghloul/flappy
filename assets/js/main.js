const hole = document.getElementById("hole");
const obstacle = document.getElementById("obstacle");
const bird = document.getElementById("bird");
const scoreBoard = document.getElementById("scoreBoard");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let pipes = 0;
let time = 0;
let isJumping = false;
let isGameOver = false;
let timer;

// أصوات
const jumpSound = new Audio("assets/jump.mp3");
const hitSound = new Audio("assets/hit.mp3");
const cheerSound = new Audio("assets/cheer.mp3");

// تغيير مكان الفتحة + تحديث السكور
hole.addEventListener("animationiteration", () => {
  let rand = Math.random() * (window.innerHeight - 200);
  hole.style.top = rand + "px";

  score++;
  pipes++;
  if (score % 10 === 0) {
    cheerSound.play();
    document.body.style.background = "linear-gradient(90deg, #ff6a00, #ee0979)";
    setTimeout(() => {
      document.body.style.background = "linear-gradient(45deg, #171427, #2b1d3f)";
    }, 1000);
  }
});

// مؤقت اللعبة
function startTimer() {
  timer = setInterval(() => {
    time++;
    updateScore();
  }, 1000);
}

// تحديث السكور
function updateScore() {
  scoreBoard.textContent = `Score: ${score} | Pipes: ${pipes} | Time: ${time}s`;
}

// الجاذبية و الاصطدام
setInterval(function () {
  if (isGameOver) return;

  let birdTop = parseInt(getComputedStyle(bird).getPropertyValue("top"));
  if (!isJumping) {
    bird.style.top = birdTop + 3 + "px";
  }

  let obstacleLeft = parseInt(getComputedStyle(obstacle).getPropertyValue("left"));
  let holeTop = parseInt(getComputedStyle(hole).getPropertyValue("top"));

  if (
    birdTop > window.innerHeight - 20 ||
    (obstacleLeft < 70 && obstacleLeft > 20 &&
      (birdTop < holeTop || birdTop > holeTop + 150))
  ) {
    gameOver();
  }
}, 10);

// القفز
function jump() {
  if (isGameOver) return;
  isJumping = true;
  jumpSound.play();
  let jumpTimer = 0;

  let jumpInterval = setInterval(function () {
    jumpTimer++;
    let birdTop = parseInt(getComputedStyle(bird).getPropertyValue("top"));
    if (birdTop > 0 && jumpTimer < 15) {
      bird.style.top = birdTop - 5 + "px";
    }
    if (jumpTimer > 20) {
      clearInterval(jumpInterval);
      isJumping = false;
    }
  }, 10);
}

// إعادة اللعبة
function gameOver() {
  isGameOver = true;
  clearInterval(timer);
  hitSound.play();
  restartBtn.style.display = "block";
}

// زر إعادة
restartBtn.addEventListener("click", () => {
  location.reload();
});

// تحكم: ماوس + كيبورد
document.addEventListener("click", jump);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
  if (e.code === "ArrowDown") bird.style.top = parseInt(bird.style.top) + 30 + "px";
});

// بدء المؤقت
startTimer();
updateScore();
