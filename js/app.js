var gameConstants = {
  "deltaX": 101,
  "deltaY": 83,
  "numberOfRows": 6,
  "numberOfColumns": 5,
  "canvasWidth": 505,
  "playerInitialX": 202,
  "playerInitialY": 415,
  "enemyCount": 3,
  "enemyInitialXValues": [0, 101, 202],
  "enemyInitialYValues": [83, 166, 249],
  "timeoutPeriod": 300
};

// the common entity
var GameEntity = function(x, y, s) {
  this.x = x;
  this.y = y;
  this.sprite = s;
};

GameEntity.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemies our player must avoid
var Enemy = function(x, y) {
  GameEntity.call(this, x, y, 'images/enemy-bug.png');
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  if (this.x < gameConstants.deltaX) {
    this.x += (gameConstants.deltaX * dt);
  } else {
    this.x += (this.x * dt);
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
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  var row = this.y / gameConstants.deltaY;

  if (row === 0) {
    this.x = gameConstants.playerInitialX;
    this.y = gameConstants.playerInitialY;
  }
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
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var k;

for (k = 0; k < gameConstants.enemyCount; k++) {
  allEnemies.push(new Enemy(gameConstants.enemyInitialXValues[k], gameConstants.enemyInitialYValues[k]));
}

// Place the player object in a variable called player
var player = new Player(gameConstants.playerInitialX, gameConstants.playerInitialY);

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
