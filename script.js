const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 7;
const AI_SPEED = 4;

// Paddle objects
let leftPaddle = {
    x: 10,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_WIDTH - 10,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

// Ball object
let ball = {
    x: WIDTH/2 - BALL_SIZE/2,
    y: HEIGHT/2 - BALL_SIZE/2,
    size: BALL_SIZE,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: 3 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    // Get mouse Y relative to canvas
    let mouseY = e.clientY - rect.top;
    // Center the paddle on mouse
    leftPaddle.y = mouseY - leftPaddle.height/2;
    // Clamp paddle within game area
    leftPaddle.y = Math.max(0, Math.min(HEIGHT - leftPaddle.height, leftPaddle.y));
});

// Game loop
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw center line
    ctx.strokeStyle = '#555';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    update();
    requestAnimationFrame(draw);
}

function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top/bottom walls
    if (ball.y <= 0 || ball.y + ball.size >= HEIGHT) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    // Left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.speedX *= -1;
        ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
        // Add some randomness to ball direction
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // Right paddle
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.speedX *= -1;
        ball.x = rightPaddle.x - ball.size; // Prevent sticking
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // Ball out of bounds (left or right): reset
    if (ball.x < 0 || ball.x > WIDTH) {
        resetBall();
    }

    // AI for right paddle: move towards ball's Y position
    if (ball.y + ball.size/2 > rightPaddle.y + rightPaddle.height/2) {
        rightPaddle.y += AI_SPEED;
    } else if (ball.y + ball.size/2 < rightPaddle.y + rightPaddle.height/2) {
        rightPaddle.y -= AI_SPEED;
    }
    // Clamp AI paddle within bounds
    rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

function resetBall() {
    ball.x = WIDTH/2 - BALL_SIZE/2;
    ball.y = HEIGHT/2 - BALL_SIZE/2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

draw();