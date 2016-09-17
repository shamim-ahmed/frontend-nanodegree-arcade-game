var delta = 101;

// the common entity
var GameEntity = function(r, c, s) {
  this.row = r;
  this.column = c;
  this.sprite = s;
};

GameEntity.prototype.getX = function () {
  return this.column * delta;
};

GameEntity.prototype.getY = function() {
  return this.row * delta;
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
  // TODO remove this duplication
  var numrows = 6;
  var numcols = 5;

  if (move === 'left' && this.column > 0) {
    this.column--;
  } else if (move === 'up' && this.row > 0) {
    this.row--;
  } else if (move === 'right' && this.column < numcols - 1) {
    this.column++;
  } else if (move === 'down' && this.row < numrows - 1) {
    this.row++;
  }

  console.log(this.row + ", " + this.column);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Place the player object in a variable called player
var player = new Player(5, 2);

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
