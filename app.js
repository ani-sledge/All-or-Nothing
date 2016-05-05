var scoreCard = angular.module('scoreCard', []);

scoreCard.controller('GameController', ['$scope',
	function($scope) {
		$scope.active = true;
		$scope.round = 1;
		$scope.team = false;
		$scope.debug = "";
		$scope.player_count = 4;
		

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

		$scope.newGame = function() {
			$scope.players = [];
			$scope.players = [
				new Player(),
				new Player(),
				new Player(),
				new Player()
			];
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
			  if (tricks == tricks_total) {      
			    if (team) {
			      score -= 50;
			    } else {
			      score -= 100;
			    }
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

		$scope.validateNum = function(player, tricks) {
			if (isNaN(player.tricks) || typeof player.tricks == typeof null) {
				player.tricks = 0;
			}
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

		$scope.advanceGame = function() {
			if ($scope.round <= 10 && $scope.active) {
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
				$scope.active = false;
			}
			for (i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i]['score'] <= 0) {
					$scope.active = false;
				}
			} 
		}

		$scope.register = function() {
		
		};
}]);


















