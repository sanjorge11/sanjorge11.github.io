var DumbAI = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

	setTimeout(function () {
	  // respective if statement in DumbAI.js
	}, 3000)
	
    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }

    this.getName = function () {
	return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts;
	player_key = pkey;

	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
	    if (e.getPassType() != Hearts.PASS_NONE) {
		var cards = current_game.getHand(player_key).getDealtCards(player_key);
		
		current_game.passCards(cards.splice(0,3), player_key);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
	    if (e.getStartPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
		var suit = playable_cards[0].getSuit(); 
		var rank = playable_cards[0].getRank();
		
		suit = mapSuit(suit); 
		rank = mapRank(rank); 
		
		ui_div.innerHTML = ("Recently Played: " +rank + " " + suit);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
	    if (e.getNextPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
		var suit = playable_cards[0].getSuit(); 
		var rank = playable_cards[0].getRank();
		
		suit = mapSuit(suit); 
		rank = mapRank(rank); 
		
		ui_div.innerHTML = ("Recently Played: " +rank + " " + suit);
	    }
	});
    }
	
	var mapRank = function(int) {
		if (int < 11) {	//assuming input will never be less than 2
			return int; 
		}
		else { 
			if (int == 11) { 
				return 'J'; 
			}
			if (int == 12) { 
				return 'Q';
			}
			if (int == 13) { 
				return 'K';
			}
			if (int == 14) { 
				return 'A';
			}
		}
	}

	var mapSuit = function(int) { 
		if (int == 0) { 
			return '&hearts;'; 
		}
		if (int == 1) { 
			return '&spades;';
		}
		if (int == 2) { 
			return '&diams;';
		}
		if (int == 3) { 
			return '&clubs;';
		}
	}
	
	
}

