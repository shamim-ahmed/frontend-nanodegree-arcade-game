var gameConstants = {
  "deltaX": 101,
  "deltaY": 83,
  "numberOfRows": 6,
  "numberOfColumns": 5,
  "canvasWidth": 505,
  "canvasHeight": 606,
  "playerInitialX": 202,
  "playerInitialY": 415,
  "enemyCount": 3,
  "enemyInitialXValues": [0, 101, 202],
  "enemyInitialYValues": [83, 166, 249]
};

// the common entity
var GameEntity = function(x, y, s) {
  this.x = x;
  this.y = y;
  this.sprite = s;
};

GameEntity.prototype.render = function() {
  //the y coordinate is slightly altered to improve the alignment of the player/enemy icons within the grid boxes
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};


// Enemies our player must avoid
var Enemy = function(x, y, sf) {
  GameEntity.call(this, x, y, 'images/enemy-bug.png');
  this.speedFactor = sf;
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x < gameConstants.deltaX) {
    this.x += (gameConstants.deltaX * dt * this.speedFactor);
  } else {
    this.x += (this.x * dt * this.speedFactor);
  }

  if (this.x > gameConstants.canvasWidth) {
    this.x = 0;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
  GameEntity.call(this, x, y, 'images/char-boy.png');
  this.score = 0;
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  var row = this.y / gameConstants.deltaY;

  if (row === 0) {
    this.incrementScore();
    this.reset();
  }
};

Player.prototype.reset = function() {
  this.x = gameConstants.playerInitialX;
  this.y = gameConstants.playerInitialY;
};

Player.prototype.incrementScore = function() {
  this.score++;
  this.displayScore();
};

Player.prototype.decrementScore = function() {
  if (this.score > 0) {
    this.score--;
  }

  this.displayScore();
};

Player.prototype.displayScore = function() {
  document.querySelector("#score").textContent = this.score;
};

Player.prototype.handleInput = function(move) {
  var row = this.y / gameConstants.deltaY;
  var column = this.x / gameConstants.deltaX;

  if (move === 'left' && column > 0) {
    column--;
  } else if (move === 'up' && row > 0) {
    row--;
  } else if (move === 'right' && column < gameConstants.numberOfColumns - 1) {
    column++;
  } else if (move === 'down' && row < gameConstants.numberOfRows - 1) {
    row++;
  }

  this.x = column * gameConstants.deltaX;
  this.y = row * gameConstants.deltaY;
};

// Now instantiate your objects.
var allEnemies = [];
var player = null;

var initializeGame = function() {
  var i;
  var r;

  for (i = 0; i < gameConstants.enemyCount; i++) {
    // generate the speed factor to indroduce some randomness in the spped of each bug
    r = generateRandomNumber();
    allEnemies.push(new Enemy(gameConstants.enemyInitialXValues[i], gameConstants.enemyInitialYValues[i], r));
  }

  player = new Player(gameConstants.playerInitialX, gameConstants.playerInitialY);
  player.displayScore();
};

function generateRandomNumber() {
  var n = 90 + Math.floor(Math.random() * 110);
  var r = n / 100.0;
  return r;
}

// initialize the global variables
initializeGame();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
