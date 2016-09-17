var gameConstants = {
  "deltaX": 101,
  "deltaY": 83,
  "numberOfRows": 6,
  "numberOfColumns": 5,
  "playerInitialRow": 5,
  "playerInitialColumn": 2,
  "enemyInitialRows": [],
  "enemyInitialColumns": []
};

// the common entity
var GameEntity = function(r, c, s) {
  this.row = r;
  this.column = c;
  this.sprite = s;
};

GameEntity.prototype.getX = function () {
  return this.column * gameConstants.deltaX;
};

GameEntity.prototype.getY = function() {
  return this.row * gameConstants.deltaY;
};

GameEntity.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.getX(), this.getY());
};


// Enemies our player must avoid
var Enemy = function(r, c) {
  GameEntity.call(this, r, c, 'images/enemy-bug.png');
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(r, c) {
  GameEntity.call(this, r, c, 'images/char-boy.png');
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

};

Player.prototype.handleInput = function(move) {
  if (move === 'left' && this.column > 0) {
    this.column--;
  } else if (move === 'up' && this.row > 0) {
    this.row--;
  } else if (move === 'right' && this.column < gameConstants.numberOfColumns - 1) {
    this.column++;
  } else if (move === 'down' && this.row < gameConstants.numberOfRows - 1) {
    this.row++;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Place the player object in a variable called player
var player = new Player(gameConstants.playerInitialRow, gameConstants.playerInitialColumn);

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
