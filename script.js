// Define HTML elements
const board             = document.getElementById('game-board');
const instructionText   = document.getElementById('instruction-text');
const logo              = document.getElementById('logo');
const score             = document.getElementById('score');
const highScoreText     = document.getElementById('highScore');

// Define game variables
const gridSize = 20;

let snake           = [{ x: 10, y: 10 }];
let food            = generateFood();
let direction       = 'right';
let gameInterval;
let gameSpeedDelay  = 200;
let gameStarted     = false;
let highScore       = 0;

// Draw game map, snake, and food
function draw() 
{
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
};

// Draw snake
function drawSnake() 
{
    snake.forEach((segment) => 
    {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
};

// Create a snake or food cube/div
function createGameElement(tag, className) 
{
    const element = document.createElement(tag);
    element.className = className;

    return element;
};

// Set position of snake or food cube/div
function setPosition(element, position) 
{
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
};

// Draw food function
function drawFood() 
{
    if (gameStarted) 
    {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    };
};

// Generate food at random location
function generateFood() 
{
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;

    return { x, y };
};

// Movements for the snake
function move() 
{
    const head = { ...snake[0] };

    switch (direction) 
    {
        case 'up':
            head.y--;
            break;

        case 'down':
            head.y++;
            break;

        case 'right':
            head.x++;
            break;

        case 'left':
            head.x--;
            break;
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) 
        {
        food = generateFood();

        increaseSpeed();
        clearInterval(gameInterval);

        gameInterval = setInterval(() => 
        {
            move();
            checkCollision();
            draw();
        }, 
        gameSpeedDelay);
    } 
    else 
    {
        snake.pop();
    };
};

// Start game function
function startGame() 
{
    gameStarted = true; // keep track of a running game.

    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => 
        {
        move();
        checkCollision();
        draw();
    }, 
    gameSpeedDelay);
};

// Keypress event listener
function handleKeyPress(event) 
{
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === '')) 
        {
        startGame();
    } else 
    {
        switch (event.key) 
        {
            case 'ArrowUp':
                direction = 'up';
                break;

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;
        };
    };
};

document.addEventListener('keydown', handleKeyPress);

// Speed up the snake
function increaseSpeed() 
{
    if (gameSpeedDelay > 150) 
    {
        gameSpeedDelay -= 5;
    } 
    else if (gameSpeedDelay > 100) 
    {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) 
    {
        gameSpeedDelay -= 2;
    } 
    else if (gameSpeedDelay > 25) 
    {
        gameSpeedDelay -= 1;
    };
};

// Check for collision
function checkCollision() 
{
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) 
    {
        resetGame();
    };

    for (let i = 1; i < snake.length; i++) 
    {
        if (head.x === snake[i].x && head.y === snake[i].y) 
        {
            resetGame();
        };
    };
};

// Reset game
function resetGame() 
{
    updateHighScore();
    stopGame();

    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;

    updateScore();
};

// Update score to save
function updateScore() 
{
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
};

// Stop game function
function stopGame() 
{
    gameStarted = false;

    clearInterval(gameInterval);

    instructionText.style.display = 'block';
    logo.style.display = 'block';
};

// Update high score
function updateHighScore() 
{
    const currentScore = snake.length - 1;

    if (currentScore > highScore) 
    {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    };

    highScoreText.style.display = 'block';
};

