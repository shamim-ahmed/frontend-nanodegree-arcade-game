frontend-nanodegree-arcade-game
===============================

##Basic Info on Frogger##
In this game you have a Player and Enemies (Bugs). The goal of the player is to reach the water, without colliding into any one of the enemies.

![alt text](https://raw.githubusercontent.com/shamim-ahmed/frontend-nanodegree-arcade-game/master/images/screenshot.png "Screenshot")

##Rules of the Game##
- The player can move left, right, up and down.
- The enemies move in varying speeds on the paved block portion of the scene.
- Once the player reaches the water, his score is incremented and he moves back to the start square.
- Once a the player collides with an enemy, his score is decremented and he moves back to the start square.
- Score cannot be negative (the minimum score is zero).
- A gem is randomly placed in the paved block portion, which the player can collect on his way to the water.
- Each time a gem is collected, the gem count is incremented. Additionally, the position and color of the gem is changed.

##Getting started##
- Clone the github repository using the following command:
  ```
  git clone https://github.com/shamim-ahmed/frontend-nanodegree-arcade-game.git
  ```
  Alternatively, you can download the archive from [here](https://github.com/shamim-ahmed/frontend-nanodegree-arcade-game/archive/master.zip) and extract it.
- Go to the *frontend-nanodegree-arcade-game* folder.
- Open index.html page using your browser.
- Select one of the characters and click 'Done'.
- You will be presented with a grid, which will show the player, the enemies and a gem.
- Use left, right, up and down keys to move the player around the grid.
- The scorecard on the left will show the current score, as well as the number of gems collected.

##Acknowledgements##
This game incorporates some code from this [example](https://gist.github.com/rcotrina94/7828886).
