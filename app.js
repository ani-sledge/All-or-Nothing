var scoreCard = angular.module('scoreCard', []);

scoreCard.controller('GameController', ['$scope',
	function($scope) {
		$scope.active = true;
		$scope.round = 1;
		$scope.team = false;
		$scope.has_edited_game = false;
		$scope.player_count = 4;
		$scope.debug = "";
		function Player() {
			this.name = "";
			this.score = 100;
			this.tricks = 0;
			this.all = false;
		}
		$scope.players = [
			new Player(),
			new Player(),
			new Player(),
			new Player()
		];

		$scope.restart = function() {
			$scope.players = [];
			for (j = 0; j < $scope.player_count; j++) {
				$scope.players.push(new Player());
			}
			$scope.active = true;
			$scope.round = 1;
			$scope.has_edited_game = false;
		}

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

		$scope.confirmTeam = function() {
			if ($scope.has_edited_game) {
				$scope.confirm = confirm("This action will cause the game to reset.\nDo you want to continue?");
				if ($scope.confirm) {
					$scope.restart();
				} else {
					$scope.team = !($scope.team); 
				}
			}
		}

		$scope.confirmCount = function() {
			if ($scope.has_edited_game) {
				$scope.confirm = confirm("This action will cause the game to reset.\nDo you want to continue?");
				if ($scope.confirm) {
					$scope.restart();
				} else {
					$scope.player_count = $scope.players.length; 
				}
			} else {
				$scope.restart();
			}
		}

		$scope.currentDealer = function(index) {
			if ($scope.round == index + 1) {
				return 'Dealer';
			} else if ($scope.round - $scope.players.length == index + 1) {
				return 'Dealer';
			} else {
				return "-----";
			}
		}

		$scope.setHasEdited = function(boolean) {
			$scope.has_edited_game = boolean;
		}

		$scope.tricksTotal = function() {
			if ($scope.players.length > 1 && $scope.players.length < 5) {
				return 10;
			} else if ($scope.players.length == 5 || $scope.players.length == 6) {
				return 8;
			} else {
				return 0
			}
		}

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

		$scope.validateTricks = function(player) {
			if (isNaN(player.tricks) || typeof player.tricks == typeof null) {
				player.tricks = 0;
			}
			$scope.setHasEdited(true);
		}

		$scope.getTeam = function() {
			if ($scope.team) {
				return 'Team';
			} else {
				return 'Player';
			}
		}
		$scope.getBid = function(all) {
			if (all) {
				return 'All';
			} else {
				return 'Nothing';
			}
		}

		$scope.prevRound = function() {
			if ($scope.active && $scope.round > 0) {
				$scope.round -= 1;
			}
		}
		$scope.meetTotalTricks = function() {
			var current_tricks = 0;
			for (i = 0; i < $scope.players.length; i++){
				current_tricks += $scope.players[i].tricks;
			} 
			if (current_tricks == $scope.tricksTotal()) {
				return true;
			} else {
				return false;
			}
		}
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
			$scope.active = false;
		}
		$scope.advanceGame = function() {
			if ($scope.round <= 10 && $scope.active) {
				if ($scope.meetTotalTricks()) {
					$scope.round += 1;
					for (i = 0; i < $scope.players.length; i++) {
						var player = $scope.players[i];
						var tricks_total = $scope.tricksTotal();
						var score_change = $scope.calculateScore(player.tricks, tricks_total, player.all, $scope.team);
						player.score += score_change;
						player.tricks = 0;
						player.all = false;
					}
				} else {
					alert("The total tricks for this round is incorrect.");
				}
			} else {
				$scope.gameOver();
			}
			for (i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i]['score'] <= 0) {
					$scope.gameOver();
				}
			} 
		}
}]);


















