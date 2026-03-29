var character = document.getElementById("character");
var game = document.getElementById("game");
var scoreDisplay = document.getElementById("score");
var startMessage = document.getElementById("startMessage");
var jumping = false;
var counter = 0;
var gameRunning = false;
var gameLoopId = null;
var jumpInterval = null;
var obstacles = [];
var obstacleInterval = null;
var velocity = 0; // Add velocity for more realistic physics
var gravity = 0.5; // Stronger gravity like original Flappy Bird
var jumpPower = -8; // Powerful upward burst
var gameStarted = false;
var obstacleCreationInProgress = false;

// Array of friend images
var images = [
    '../photos/GarinFraley.png',
    '../photos/touchingED1.png',
    '../photos/touchingED2.png',
    '../photos/touchingED3.png'
];

// Get game dimensions
function getGameDimensions() {
    return {
        width: game.offsetWidth,
        height: game.offsetHeight
    };
}

// Create a single image obstacle
function createObstacle() {
    if (obstacleCreationInProgress || !gameRunning) return;
    
    obstacleCreationInProgress = true;
    
    var dimensions = getGameDimensions();
    var obstacleWidth = window.innerWidth <= 768 ? 160 : 250;
    
    // Random Y position for the obstacle
    var randomY = Math.random() * (dimensions.height - 100) + 50;
    
    // Random image for this obstacle
    var imgIndex = Math.floor(Math.random() * images.length);
    var imageUrl = images[imgIndex];
    
    // Create obstacle container
    var obstacleContainer = document.createElement('div');
    obstacleContainer.className = 'obstacle';
    obstacleContainer.style.width = obstacleWidth + 'px';
    obstacleContainer.style.top = randomY + 'px';
    
    // Add image
    var img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    obstacleContainer.appendChild(img);
    game.appendChild(obstacleContainer);
    
    // Store obstacle data for collision detection
    obstacles.push({
        element: obstacleContainer,
        y: randomY,
        width: obstacleWidth,
        imageUrl: imageUrl
    });
    
    // Remove obstacle after animation completes
    setTimeout(function() {
        if (obstacleContainer && obstacleContainer.parentNode) {
            obstacleContainer.parentNode.removeChild(obstacleContainer);
            // Remove from obstacles array
            var index = obstacles.findIndex(obs => obs.element === obstacleContainer);
            if (index !== -1) obstacles.splice(index, 1);
        }
    }, 2500);
    
    // Reset creation flag
    setTimeout(function() {
        obstacleCreationInProgress = false;
    }, 100);
}

// Main game loop with realistic physics
function gameLoop() {
    if (!gameRunning) return;
    
    var dimensions = getGameDimensions();
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var maxBottom = dimensions.height - character.offsetHeight - 10;
    
    // Apply gravity to velocity (like original Flappy Bird)
    velocity += gravity;
    var newTop = characterTop + velocity;
    
    // Apply position change
    if (newTop <= maxBottom) {
        character.style.top = Math.max(0, newTop) + "px";
    } else {
        gameOver();
        return;
    }
    
    // Check ceiling
    if (characterTop <= 0) {
        gameOver();
        return;
    }
    
    // Add slight rotation based on velocity (optional visual effect)
    var rotation = Math.min(Math.max(velocity * 3, -30), 30);
    character.style.transform = `rotate(${rotation}deg)`;
    
    // Get character hitbox
    var characterRect = character.getBoundingClientRect();
    var gameRect = game.getBoundingClientRect();
    
    // Check collision with each obstacle
    for (var i = 0; i < obstacles.length; i++) {
        var obs = obstacles[i];
        var obsRect = obs.element.getBoundingClientRect();
        
        // Check if character touches the obstacle image
        if (characterRect.right > obsRect.left && 
            characterRect.left < obsRect.right &&
            characterRect.bottom > obsRect.top &&
            characterRect.top < obsRect.bottom) {
            gameOver();
            return;
        }
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Generate obstacles at intervals
function startObstacleGeneration() {
    if (obstacleInterval) clearInterval(obstacleInterval);
    
    obstacleInterval = setInterval(function() {
        if (gameRunning && !obstacleCreationInProgress) {
            createObstacle();
            counter++;
            scoreDisplay.innerText = counter;
        }
    }, 1500);
}

function gameOver() {
    if (!gameRunning) return;
    
    gameRunning = false;
    gameStarted = false;
    
    // Reset rotation
    character.style.transform = 'rotate(0deg)';
    
    // Cancel all animations
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (obstacleInterval) clearInterval(obstacleInterval);
    if (jumpInterval) clearInterval(jumpInterval);
    
    // Remove all obstacles
    obstacles.forEach(function(obs) {
        if (obs.element && obs.element.parentNode) {
            obs.element.parentNode.removeChild(obs.element);
        }
    });
    obstacles = [];
    
    // Reset creation flag
    obstacleCreationInProgress = false;
    
    // Show game over message
    startMessage.style.display = 'block';
    startMessage.innerText = `Score: ${counter}\nClick anywhere to play again`;
    
    // Reset score display
    scoreDisplay.innerText = "0";
}

function resetGame() {
    // Reset game state
    gameRunning = true;
    gameStarted = true;
    counter = 0;
    obstacleCreationInProgress = false;
    velocity = 0; // Reset velocity
    
    // Reset character position to middle
    var dimensions = getGameDimensions();
    character.style.top = (dimensions.height / 2) + "px";
    character.style.transform = 'rotate(0deg)';
    
    // Hide start message
    startMessage.style.display = 'none';
    
    // Clear all existing obstacles
    obstacles.forEach(function(obs) {
        if (obs.element && obs.element.parentNode) {
            obs.element.parentNode.removeChild(obs.element);
        }
    });
    obstacles = [];
    
    // Clear intervals
    if (obstacleInterval) clearInterval(obstacleInterval);
    if (jumpInterval) clearInterval(jumpInterval);
    
    // Restart game loops
    startObstacleGeneration();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function jump() {
    if (!gameRunning) return;
    
    // Original Flappy Bird style jump - immediate velocity change
    velocity = jumpPower;
    
    // Add a little visual feedback
    character.style.transform = 'rotate(-20deg)';
    setTimeout(function() {
        if (gameRunning) {
            var currentRot = parseInt(character.style.transform.replace('rotate(', '').replace('deg)', ''));
            if (currentRot < 0) {
                // Rotation will be handled by game loop
            }
        }
    }, 100);
}

// Handle click/tap anywhere on screen
function handleGameClick(e) {
    e.preventDefault();
    
    if (!gameStarted) {
        resetGame();
    } else if (gameRunning) {
        jump();
    }
}

// Initialize the game
function initGame() {
    // Set initial character position
    var dimensions = getGameDimensions();
    character.style.top = (dimensions.height / 2) + "px";
    character.style.transition = 'transform 0.1s ease';
    
    // Add click listener to the whole game area
    game.addEventListener('click', handleGameClick);
    
    // Also handle touch events for mobile
    game.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleGameClick(e);
    });
    
    // Show start message
    startMessage.style.display = 'block';
}

// Handle window resize
window.addEventListener('resize', function() {
    if (gameRunning) {
        var dimensions = getGameDimensions();
        var currentTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var maxTop = dimensions.height - character.offsetHeight;
        
        if (currentTop > maxTop) {
            character.style.top = maxTop + "px";
            velocity = 0;
        }
    }
});

// Start the game
initGame();