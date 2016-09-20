// the constants used by various classes and game engine
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
  "enemyInitialYValues": [83, 166, 249],
  "gemIconFiles": ["images/gem-orange.png", "images/gem-green.png", "images/gem-blue.png"]
};

// the superclass that contains all the common fields and methods
var GameEntity = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
};

// Render a game entity within a particular square in the grid.
// The placement is based on the value of x and y coordinates of the entity.
GameEntity.prototype.render = function() {
  // the y coordinate is slightly altered to improve the alignment of the player/enemy icons within the grid squares
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};

// Gems are collectibles which are placed randomly on the grid.
// A player can collect them as he tries to reach the water.
var Gem = function(x, y, sprite) {
  GameEntity.call(this, x, y, sprite);
};

Gem.prototype = Object.create(GameEntity.prototype);
Gem.prototype.constructor = Gem;

// Render the gem within a particular square of the grid.
// This method overrides the superclass logic in order to improve the placement of the gem within the square.
Gem.prototype.render = function() {
  //the y coordinate is slightly altered to improve the alignment of the player/enemy icons within the grid boxes
  ctx.drawImage(Resources.get(this.sprite), this.x + 25, this.y + 35);
};

// This method is called once the gem is collected by the player.
// It changes the location and (potentially) the icon of the gem.
Gem.prototype.reset = function() {
  var oldRow = this.y / gameConstants.deltaY;
  var oldColumn = this.x / gameConstants.deltaX;

  // randomly generate the new position of the gem and (possibly) use a new icon
  var row = 1 + Math.floor(Math.random() * 3);
  var column = Math.floor(Math.random() * gameConstants.numberOfColumns);
  var i = Math.floor(Math.random() * gameConstants.gemIconFiles.length);

  // this logic ensures that the gem always moves to a new location in the grid
  if (row === oldRow && column == oldColumn) {
    column += 1;

    if (column >= gameConstants.numberOfColumns) {
      column = 0;
    }
  }

  // update the gem instance with new position and icon
  this.x = column * gameConstants.deltaX;
  this.y = row * gameConstants.deltaY;
  this.sprite = gameConstants.gemIconFiles[i];
};

// Enemies our player must avoid
var Enemy = function(x, y, sprite, sf) {
  GameEntity.call(this, x, y, sprite);
  this.speedFactor = sf;
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game.
// The speedFactor introduces an additional level of randomness in the speed.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x < gameConstants.deltaX) {
    this.x += (gameConstants.deltaX * dt * this.speedFactor);
  } else {
    this.x += (this.x * dt * this.speedFactor);
  }

  // ensure that when the enemy reaches the end of the grid, it can reappear from the other end.
  if (this.x > gameConstants.canvasWidth) {
    this.x = 0;
  }
};

// The protagonist of our game.
// The player's goal is to reach the top row without colliding with any of the moving bugs.
// He also keeps track of his own score and gem count.
var Player = function(x, y, sprite) {
  GameEntity.call(this, x, y, sprite);
  this.score = 0;
  this.gemCount = 0;
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

// Detect if player has reached the top row, and increment score accordingly.
Player.prototype.update = function() {
  var row = this.y / gameConstants.deltaY;

  if (row === 0) {
    this.incrementScore();
    this.reset();
  }
};

// Move the player to the starting position.
// This method is called when the player has reached the top row (water)
// or when he has collided with a bug.
Player.prototype.reset = function() {
  this.x = gameConstants.playerInitialX;
  this.y = gameConstants.playerInitialY;
};

// increment the score by 1 when the player has reached the top row (water)
Player.prototype.incrementScore = function() {
  this.score++;
  this.displayUpdatedInfo();
};

// Decrement the score by 1 when the player has collided with a bug.
// Please note that score cannot be negative. So, the decrement operation is
// performed only when current score >= 1
Player.prototype.decrementScore = function() {
  if (this.score > 0) {
    this.score--;
  }

  this.displayUpdatedInfo();
};

// Increment the gem count by 1 when the player has collected a gem.
Player.prototype.incrementGemCount = function() {
  this.gemCount++;
  this.displayUpdatedInfo();
};

// Display the current score and gem count.
// This method is invoked every time the score or gem count gets updated due to
// various game events.
Player.prototype.displayUpdatedInfo = function() {
  document.querySelector("#score").textContent = this.score;
  document.querySelector("#gem-count").textContent = this.gemCount;
};

// Handle key press that determines the player's movement within the grid.
// Note that the player must not be able to move out of the grid.
Player.prototype.handleInput = function(move) {
  var row = this.y / gameConstants.deltaY;
  var column = this.x / gameConstants.deltaX;

  if (move === "left" && column > 0) {
    column--;
  } else if (move === "up" && row > 0) {
    row--;
  } else if (move === "right" && column < gameConstants.numberOfColumns - 1) {
    column++;
  } else if (move === "down" && row < gameConstants.numberOfRows - 1) {
    row++;
  }

  this.x = column * gameConstants.deltaX;
  this.y = row * gameConstants.deltaY;
};

// The entities used in the game (e.g. enemies, player and gem)
var allEnemies = [];
var player = null;
var gem = null;

// Initialize all the game entities
var initializeGame = function() {
  var i;
  var r;
  var enemy;

  // create the enemies
  for (i = 0; i < gameConstants.enemyCount; i++) {
    // generate the speed factor to introduce some randomness in the speed of each bug
    r = generateSpeedFactor();
    enemy = new Enemy(gameConstants.enemyInitialXValues[i], gameConstants.enemyInitialYValues[i], "images/enemy-bug.png", r);
    allEnemies.push(enemy);
  }

  // Create the gem with dummy value and then invoke reset to place it
  // in a random square within the grid
  gem = new Gem(0, 0, "images/gem-blue.png");
  gem.reset();

  // create the player
  player = new Player(gameConstants.playerInitialX, gameConstants.playerInitialY, "images/char-boy.png");
  player.displayUpdatedInfo();
};

// Generate a random number >= 0.9 and < 2.0.
// The generated value is used to initialize an enemy.
function generateSpeedFactor() {
  var n = 90 + Math.floor(Math.random() * 110);
  var r = n / 100.0;
  return r;
}

initializeGame();

// prompt the user for a selection
document.body.onload = function() {
  // hide the grid initially
  var mainDiv = document.getElementById("main-container");
  mainDiv.style.display = "none";

  // show the div with character icons
  var selectorDiv = document.getElementById("character-selector");
  selectorDiv.style.display = "block";

  // detect which character has been selected
  var selectButton = document.getElementById("select-button");
  selectButton.onclick = function() {
    var selectedValue = null;
    var radioButtons = document.getElementsByName("avatar");
    var i;

    for (i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        selectedValue = radioButtons[i].value;
        break;
      }
    }

    // the default icon
    if (selectedValue === null) {
      selectedValue = "char-boy";
    }

    // update the player with the new icon and render
    var iconFile = "images/" + selectedValue + ".png";
    player.sprite = iconFile;
    player.render();

    // display the grid, and hide the character selection options
    mainDiv.style.display = "block";
    selectorDiv.style.display = "none";
  };
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
