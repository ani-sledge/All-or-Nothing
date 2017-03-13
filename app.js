var scoreCard = angular.module('scoreCard', []);

scoreCard.controller('GameController', ['$scope',
	function($scope) {
		/**
		 * Represents a player.
		 * @constructor
		 */
		function Player() {
			this.name = "";
			this.score = 100;
			this.tricks = "0";
			this.all = false;
		}

		//Game settings
		$scope.active = true;
		$scope.instructions = false;
		$scope.round = 1;
		$scope.dealer = 0;
		$scope.team = false;
		$scope.has_edited_game = false;
		$scope.player_count = "4";
		$scope.options = [2, 3, 4, 5, 6, 7, 8];
		$scope.debug = "";  
		$scope.players = [
			new Player(true),
			new Player(false),
			new Player(false),
			new Player(false)
		];

		//Number of tricks by number of players
		var trick_lookup = {
			"2": 10,
			"3": 10,
			"4": 10,
			"5": 8,
			"6": 8,
			"7": 6,
			"8": 6,
			"team-2": 10,
			"team-3": 8,
			"team-4": 6 
		}

		/**
		 * Returns game settings to their initial state.
		 */
		$scope.restart = function() {
			$scope.players = [];
			for (j = 0; j < $scope.player_count; j++) {
				$scope.players.push(new Player());
			}
			$scope.active = true;
			$scope.round = 1;
			$scope.dealer = 0;
			$scope.has_edited_game = false;
		}

		/**
		 * If the game is in play, asks the user for confirmation before restarting the game.
		 */
		$scope.newGame = function() {
			if ($scope.has_edited_game) {
				$scope.confirm = confirm("This action will cause the game to reset.\nDo you want to continue?");
				if ($scope.confirm) {
					$scope.restart();
				}
			} else {
				$scope.restart();
			}
		}

		/**
		 * Resets the game when the user switches to 'team' mode.
		 */
		$scope.confirmTeam = function() {
			if ($scope.has_edited_game) {
				$scope.confirm = confirm("This action will cause the game to reset.\nDo you want to continue?");
				if ($scope.confirm) {
					if ($scope.player_count > 4) {
						$scope.player_count = "4";
					}
					$scope.restart();
				} else {
					$scope.team = !($scope.team); 
					if ($scope.team) {
						$scope.restart();
					} 
				}
			} else if ($scope.player_count > 4) {
				$scope.player_count = "4";
				$scope.restart();
			} else {
				$scope.restart();
			}
		}

		/**
		 * Returns the possible numbers of players with or without team play. For use in an <option> tag.
		 */
		$scope.teamOptions = function() {
			if ($scope.team) {
				return [2, 3, 4];
			} else {
				return [2, 3, 4, 5, 6, 7, 8];
			}
		}

		/**
		 * Returns the possible number of tricks taken based on the number of players. For use in an <option> tag.
		 */
		$scope.trickOptions = function() {
			var tricksList = [];
			for (i = 0; i <= $scope.tricksTotal(); i++) {
				tricksList.push(i);
			}
			return tricksList;
		}

		/**
		 * If the game is in play, asks the user for confirmation before changing the number of players.
		 */
		$scope.confirmCount = function() {
			if ($scope.has_edited_game) {
				$scope.confirm = confirm("This action will cause the game to reset.\nDo you want to continue?");
				if ($scope.confirm) {
					$scope.restart();
				} else { 
					$scope.player_count = String($scope.players.length);
				}
			} else {
				$scope.restart();
			} 
		}

		/**
		 * Sets the has_edited_game property.
		 * @param {boolean} hasEdited - Whether the game has been updated since initialization.
		 */
		$scope.setHasEdited = function(hasEdited) {
			$scope.has_edited_game = hasEdited;
		}

		/**
		 * Returns the total tricks per round, based on the number of players and team setting. 
		 */
		$scope.tricksTotal = function() {
			if ($scope.team) {
				var id = "team-" + $scope.player_count; 
				return trick_lookup[id];
			} else {
				return trick_lookup[$scope.player_count];
			}
			
		}

		/**
		 * Sets the position of the dealer in the list of players.
		 * @param {number} index - The current index of the dealer.
		 */
		$scope.changeDealer = function(index) {
			$scope.dealer = index;
		}

		/**
		 * Calculates the current score for a player.
		 * @param {number} tricks - The number of tricks taken by the player this round.
		 * @param {number} tricks_total - The total tricks for each round.
		 * @param {boolean} all - Whether the player bid 'all' or 'nothing'.
		 * @param {boolean} team - Wether team play is enabled.
		 */
		$scope.calculateScore = function(tricks, tricks_total, all, team) {
			var score = 0;
			if (all) {
				if (tricks == tricks_total && team) {
					score -= 50;
				} else if (tricks == tricks_total && !team) {
					score -= 100;
				} else {
					score += (tricks_total - tricks) * 10;
				}
			} else {
				if (tricks == 0) {
					score -= 20;
				} else {
					score += tricks * 10;
				}
			}
			return score;
		}

		/**
		 * Returns the <label> text to indicate the current team setting.
		 */
		$scope.getTeam = function() {
			if ($scope.team) {
				return 'Team';
			} else {
				return 'Player';
			}
		}

		/**
		 * Returns the <label> text to indicate a player's bid.
		 */
		$scope.getBid = function(all) {
			if (all) {
				return 'All';
			} else {
				return 'Nothing';
			}
		}
 
 		/**
 		 * Checks that the sum of the players' tricks taken matches the total tricks for each round.
 		 */
		$scope.meetTotalTricks = function() {
			var current_tricks = 0;
			for (i = 0; i < $scope.players.length; i++){
				current_tricks += Number($scope.players[i].tricks);
			} 
			if (current_tricks == $scope.tricksTotal()) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Indicates that the instructions view should be shown.
		 */
		$scope.showInstructions = function() {
			$scope.instructions = true;
		}

		/**
		 * Indicates that the instructions view should be hidden.
		 */
		$scope.hideInstructions = function() {
			$scope.instructions = false;
		}

		/**
		 * Converts a number to a place.
		 * @param {number} num - The index of the player.
		 */
		$scope.getPlace = function(num) {
	        if (num == 1) {
	          	return '1st';
	        } else if (num == 2) {
	          	return '2nd';
	        } else if (num == 3) {
	          	return '3rd';
	        } else {
	          	return num + "th";
	        }
      	}

      	/**
      	 * Ends the game and shows the players' final scores.
      	 */
		$scope.gameOver = function() {
			for (i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i].name == "") {
					if ($scope.team) {
						$scope.players[i].name = "Team " + (i + 1);
					} else {
						$scope.players[i].name = "Player " + (i + 1);
					}
				}
			}
			$scope.round = 0;
			$scope.active = false;
			$scope.has_edited_game = false;
		}

		/**
		 * Advances the game by one round.
		 */
		$scope.advanceGame = function() {	
			//The game lasts ten rounds maximum
			if ($scope.round <= 10 && $scope.active) {

				//Round cannot advance until all the tricks are taken
				if ($scope.meetTotalTricks()) {
					$scope.round += 1;
					$scope.dealer = ($scope.dealer + 1) % $scope.player_count;

					//Update each player's score
					for (i = 0; i < $scope.players.length; i++) {
						var player = $scope.players[i];
						var tricks_total = $scope.tricksTotal();
						var score_change = $scope.calculateScore(player.tricks, tricks_total, player.all, $scope.team);
						player.score += score_change;
						player.tricks = "0";
						player.all = false;
					}
					if ($scope.round == 11) {
						$scope.gameOver();
					}
				} else {
					alert("The total tricks for this round is incorrect.");
				}
			} else {
				$scope.gameOver();
			}

			//A player wins if their score is less than 0
			for (i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i]['score'] <= 0) {
					$scope.gameOver();
				}
			} 
		}
}]);


















