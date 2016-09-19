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

// the common entity
var GameEntity = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
};

GameEntity.prototype.render = function() {
  //the y coordinate is slightly altered to improve the alignment of the player/enemy icons within the grid boxes
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};

// Gems are collectibles
var Gem = function(x, y, sprite) {
  GameEntity.call(this, x, y, sprite);
};

Gem.prototype = Object.create(GameEntity.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.reset = function() {
  var row = 1 + Math.floor(Math.random() * 3);
  var column = Math.floor(Math.random() * gameConstants.numberOfColumns);
  var i = Math.floor(Math.random() * gameConstants.gemIconFiles.length);

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
var Player = function(x, y, sprite) {
  GameEntity.call(this, x, y, sprite);
  this.score = 0;
  this.gemCount = 0;
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

Player.prototype.incrementGemCount = function() {
  this.gemCount++;
  this.displayScore();
};

Player.prototype.displayScore = function() {
  document.querySelector("#score").textContent = this.score;
  document.querySelector("#gem-count").textContent = this.gemCount;
};

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

// Now instantiate your objects.
var allEnemies = [];
var player = null;
var gem = null;

var initializeGame = function() {
  var i;
  var r;
  var enemy;

  // create the enemies
  for (i = 0; i < gameConstants.enemyCount; i++) {
    // generate the speed factor to indroduce some randomness in the spped of each bug
    r = generateRandomNumber();
    enemy = new Enemy(gameConstants.enemyInitialXValues[i], gameConstants.enemyInitialYValues[i], "images/enemy-bug.png", r);
    allEnemies.push(enemy);
  }

  // create the gem
  gem = new Gem(0, 0, "images/gem-blue.png");
  gem.reset();

  // create the player
  player = new Player(gameConstants.playerInitialX, gameConstants.playerInitialY, "images/char-boy.png");
  player.displayScore();
};

function generateRandomNumber() {
  var n = 90 + Math.floor(Math.random() * 110);
  var r = n / 100.0;
  return r;
}

initializeGame();

// prompt the user for a selection
document.body.onload = function() {
  var mainDiv = document.getElementById("main-container");
  mainDiv.style.display = "none";

  var selectorDiv = document.getElementById("character-selector");
  selectorDiv.style.display = "block";

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

    if (selectedValue === null) {
      selectedValue = "char-boy";
    }

    var iconFile = "images/" + selectedValue + ".png";
    player.sprite = iconFile;
    player.render();

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
