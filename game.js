const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;

// Paddles
let leftPaddle = {
  x: 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#4caf50"
};

let rightPaddle = {
  x: WIDTH - PADDLE_WIDTH - 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#e91e63"
};

// Ball
let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  speed: 6,
  dx: 6,
  dy: 3,
  color: "#fff"
};

// Game state
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener("mousemove", function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2;
  // Prevent going out of bounds
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + leftPaddle.height > HEIGHT) leftPaddle.y = HEIGHT - leftPaddle.height;
});

// Draw paddles, ball, and scores
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw paddles
  ctx.fillStyle = leftPaddle.color;
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  ctx.fillStyle = rightPaddle.color;
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Draw ball
  ctx.fillStyle = ball.color;
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

  // Draw scores
  ctx.font = "36px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(leftScore, WIDTH / 4, 50);
  ctx.fillText(rightScore, WIDTH * 3 / 4, 50);
}

// Ball movement and collision
function update() {
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top/bottom walls
  if (ball.y <= 0 || ball.y + ball.size >= HEIGHT) {
    ball.dy *= -1;
  }

  // Ball collision with left paddle
  if (
    ball.x <= leftPaddle.x + leftPaddle.width &&
    ball.y + ball.size >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height
  ) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
    // Add some randomness to ball's angle
    ball.dy = (Math.random() - 0.5) * 8;
  }

  // Ball collision with right paddle
  if (
    ball.x + ball.size >= rightPaddle.x &&
    ball.y + ball.size >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height
  ) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.size; // Prevent sticking
    ball.dy = (Math.random() - 0.5) * 8;
  }

  // Score for right side (player missed)
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  }

  // Score for left side (AI missed)
  if (ball.x + ball.size > WIDTH) {
    leftScore++;
    resetBall();
  }

  // AI movement: move right paddle towards ball
  let aiCenter = rightPaddle.y + rightPaddle.height / 2;
  let ballCenter = ball.y + ball.size / 2;
  let aiSpeed = 5;
  if (aiCenter < ballCenter - 10) {
    rightPaddle.y += aiSpeed;
  } else if (aiCenter > ballCenter + 10) {
    rightPaddle.y -= aiSpeed;
  }
  // Prevent AI paddle from going out of bounds
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > HEIGHT) rightPaddle.y = HEIGHT - rightPaddle.height;
}

function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
  ball.dy = (Math.random() - 0.5) * 6;
}

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
