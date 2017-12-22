var TextPlayer = function (name, ui_div) {

	//i added this 
	var cards = []; //html
	var cardObjs = []; //global card objects
	//var passBool = true; //if this is true, click listener adds to pass, otherwise adds 1 card to play
	

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var ui_message_log = $("<div class='text_player_message_log'></div>");
    var ui_input_form = $("<form class='text_player_input_form'><input type='text' class='text_player_input'></form>");

    $(ui_div).append(ui_message_log).append(ui_input_form);

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
	
	//i only prompt the game once, ever
	alert("Welcome to Hearts")
	promptName();

	//this was changed 
	cards = document.getElementsByClassName("card");
    }
	
	//////
    this.getName = function () {
	return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts;
	player_key = pkey;

////my edits start HERE
	game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
	    message_log_append($("<div class='text_player_message'>"+e.toString()+"</div>"));
	});


	//this was added by me
	
	
	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function(e) { 
    	//promptName();
		
    	updateCards();		
		//reloadClicker(); 
		
		
		//if you don't pass, you play
		//alert (e.getPassType()); 
		if (e.getPassType() != Hearts.PASS_NONE) { 
			timeToPass(); 
			setTimeout(function() {
			alert("Pass Three Cards")
			}, 200);
		}
		
    });
	
	
	current_game.registerEventHandler(Hearts.PASSING_COMPLETE_EVENT, function(e) { 
    	//alert( "NICE" ); 
		updateCards(); 
		//checkFor2C(); 
    });


	current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function(e) { 
		if (e.getStartPos() == position) { 
			//alert("Your turn");
			timeToPlay(); 
			
		}
    });
	
	current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function(e) { 
		if (e.getNextPos() == position) { 
			//alert("Your turn");
			timeToPlay(); 
		}
    });
	
	current_game.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function(e) { 
		setTimeout(function() {
		alert ( e.getTrick().getWinner() + " won this trick." ); 
		}, 100);
    });
	
	current_game.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function(e) {
		if (e.getPosition() == position) {
			$("#player-action1").html( "Recently Played: " + mapRank(e.getCard().getRank() ) + " " + mapSuit( e.getCard().getSuit() ) );
			// console.log( e.getCard() );
		}
    });

	
	current_game.registerEventHandler(Hearts.GAME_OVER_EVENT, function(e) { 
    	
		console.log( match.getScoreboard()[Hearts.NORTH] );
		console.log( match.getScoreboard()[Hearts.EAST] );
		console.log( match.getScoreboard()[Hearts.SOUTH] );
		console.log( match.getScoreboard()[Hearts.WEST] );
		


		$("#player-score1").html("Current Score: " + match.getScoreboard()[Hearts.NORTH]);
		$("#player-score2").html("Current Score: " + match.getScoreboard()[Hearts.EAST]);
		$("#player-score3").html("Current Score: " + match.getScoreboard()[Hearts.SOUTH]);
		$("#player-score4").html("Current Score: " + match.getScoreboard()[Hearts.WEST]);
		

		
		
		// $("#player-score1").replaceWith( "<h5>Score: " + match.getScoreboard()[Hearts.NORTH]	+ "</h5>" );
// 		$("#player-score2").replaceWith( "<h5>Score: " + match.getScoreboard()[Hearts.EAST]	+ "</h5>" );
// 		$("#player-score3").replaceWith( "<h5>Score: " + match.getScoreboard()[Hearts.SOUTH]	+ "</h5>" );
// 		$("#player-score4").replaceWith( "<h5>Score: " + match.getScoreboard()[Hearts.WEST]	+ "</h5>" );
		
		
    });
	
    } 
/////////////
	var promptName = function() { 
		var person = prompt("What's your name?"); 
		document.getElementById("player-name").innerHTML = person; 
	}
	
	var checkFor2C = function() { 
		
		//you could save index in previous updateCards, then just grab it and play -- this works too 
		for(var a=0; a<cardObjs.length; a++) { 
			if (cardObjs[a].getRank() == 2 && cardObjs[a].getSuit() == 3){
				alert (mapRank(cardObjs[a].getRank()) + ' ' + mapSuit(cardObjs[a].getSuit()) + " will get played automatically");
				
				current_game.playCard(cardObjs[a], player_key);
				break; 
			}
		}
		updateCards(); 
	}
	
	//you actually play in this game, no passing, so we add back the classes 
	var timeToPlay = function (){
		$("#passButton").addClass("done");
		$("#playButton").addClass("ready");
	}
	
	var timeToPass = function (){
		$("#passButton").removeClass("done");
		$("#playButton").removeClass("ready");
	}

	
	var updateCards = function() { 
		var unplayedCards = current_game.getHand(player_key).getUnplayedCards(player_key); 
		//var playedCards = current_game.getHand(player_key).getPlayedCards(played_key);
		cardObjs = current_game.getHand(player_key).getUnplayedCards(player_key); 
		
		$(".blur").removeClass("blur");
		
		//clear hand all divs 
		$( ".card" ).remove();
		
		var divHTML = []; 

		for (var a=0; a<unplayedCards.length; a++) { 
			var card = unplayedCards[a]; 
				//create new div with 
				var newDiv = document.createElement("div"); 
				$( "#cards" ).append( newDiv );
				newDiv.classList.add("card");
				
				newDiv.classList.remove('playable');
				newDiv.innerHTML = mapRank(card.getRank()) + ' ' + mapSuit(card.getSuit()); 
				
				$(newDiv).attr('id', 'num' + a);
				divHTML.push( newDiv );
		}
		
		
		if (  $("#playButton").hasClass("ready") == true ) { 
			//alert(" inside inner  ");
			var playableCards = current_game.getHand(player_key).getPlayableCards(player_key);
			
			for (var b=0; b<playableCards.length; b++){
				for (var c=0; c<unplayedCards.length; c++){

					if (unplayedCards[c].getRank() == playableCards[b].getRank() && unplayedCards[c].getSuit() == playableCards[b].getSuit()){
						divHTML[c].classList.add("playable");
					}

				}
			}
		}
		
		reloadClicker(); 
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


//get three cards / get one card
	var threeCards = []; 
	var cardToPlay = []; 
	
	var reloadClicker = function() {
		$(".card").click(function(){
			var index = parseInt( $(this).attr('id').slice(3) );
		
			if ( $("#playButton").hasClass("ready") == true ) {  //if ready to play, then add to array to play
				if (cardToPlay.length < 1) { 
					cardToPlay.push( cardObjs[index] );
					$(this).addClass( "blur" );
				}
			}
			else { 
				if (!threeCards.includes( cardObjs[index] )) { 
					if (threeCards.length < 3) {
						threeCards.push( cardObjs[index] )
						$(this).addClass( "blur" );
					}
				}
			}
			
		});
	}

	//play card -- only works if ready
	$("#playButton").click(function(){
		if ( $(this).hasClass("ready") == true) { 
			if (cardToPlay.length == 1) { 
				var playSuccess = current_game.playCard(cardToPlay[0], player_key);
				updateCards(); 
				cardToPlay = []; 
				if (!playSuccess){
					alert ("You played the wrong suit");
				}
			}
			else {
				alert ("You need a card to play");
			}
		}
		else {
			alert ("You need to pass three cards");
		}
	});


	//pass them -- only works if not done
	$("#passButton").click(function(){
		if ( $(this).hasClass("done") == false) { 
			if (threeCards.length == 3) {
				current_game.passCards(threeCards, player_key);
				$(this).addClass( "done" );
				$("#playButton").addClass( "ready" );
				threeCards = [];//this was added to fix
				updateCards(); 
			}
			else {
				alert ("Needs to pass three cards");
			}
		}else {
			alert ("You need to play a card");
		}
	});
	
	//or clear the three cards you selected 
	$("#clearButton").click(function(){
		threeCards = []; 
		cardToPlay = []; 
		
		$(".blur").removeClass("blur");
		//alert (threeCards); 
	});
	


	var startButtonReset = function(){
		alert("wow");
		$("#passButton").removeClass("done");
		$("#playButton").removeClass("ready");
	}


///////////////////////////
    var message_log_append = function (msg) {
	ui_message_log.append($(msg));
	ui_message_log.scrollTop(ui_message_log.prop("scrollHeight")-ui_message_log.height());
    }
    
    ui_input_form.on('submit', function (e) {
	e.preventDefault();
	var cmd = $(this).find('.text_player_input').val().split(" ");
	action = cmd[0];
	if (action == "pass") {
	    var cards = [new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2])),
			 new Card(Card.parseRank(cmd[3]), Card.parseSuit(cmd[4])),
			 new Card(Card.parseRank(cmd[5]), Card.parseSuit(cmd[6]))];
	    if (!current_game.passCards(cards, player_key)) {
		message_log_append($("<div class='text_player_message error'>Card pass failed!</div>"));
	    } else {
		message_log_append($("<div class='text_player_message'>Cards passed. Waiting for first trick to start.</div>"));
	    }
	} else if (action == "showPlayable") {
	    var playable = current_game.getHand(player_key).getPlayableCards(player_key);
	    var playable_message = $("<div class='text_player_message'>Playable cards:</div>");
	    var playable_list = $("<ul></ul>");
	    playable.forEach(function (c) {
		playable_list.append($("<li>"+c.toString()+"</li>"));
	    });
	    playable_message.append(playable_list);
	    message_log_append(playable_message);
	} else if (action == "showDealt") {
	    var dealt = current_game.getHand(player_key).getDealtCards(player_key);
	    var dealt_message = $("<div class='text_player_message'>Dealt cards:</div>");
	    var dealt_list = $("<ul></ul>");
	    dealt.forEach(function (c) {
		dealt_list.append($("<li>"+c.toString()+"</li>"));
	    });
	    dealt_message.append(dealt_list);
	    message_log_append(dealt_message);
	} else if (action == "play") {
	    var card_to_play = new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2]));
	    if (!current_game.playCard(card_to_play, player_key)) {
		message_log_append($("<div class='text_player_message error'>Attempt to play " +
					card_to_play.toString() + " failed!</div>"));
	    }
	} else if (action == "autoplay") {
	    var autoplay_handler = function (e) {
		if (current_game.getNextToPlay() == position) {
		    current_game.playCard(current_game.getHand(player_key).getPlayableCards(player_key)[0],
					  player_key);
		}
	    }
	    
	    current_game.registerEventHandler(Hearts.TRICK_START_EVENT, autoplay_handler);
	    current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, autoplay_handler);
	    autoplay_handler();
	} else if (action == "scoreboard") {
	    var sb = match.getScoreboard();
	    message_log_append($("<div class='text_player_message'>Scoreboard:<ul>"+
				    "<li>"+match.getPlayerName(Hearts.NORTH)+": " +
				    sb[Hearts.NORTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.EAST)+": " +
				    sb[Hearts.EAST] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.SOUTH)+": " +
				    sb[Hearts.SOUTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.WEST)+": " +
				    sb[Hearts.WEST] + "</li>" +
				    "</ul></div>"));
	}else {
	    message_log_append($("<div class='text_player_message error'>Unknown action: " + action + "</div>"));
	}
	// Clear text input
	$(this).find('.text_player_input').val("")
    });
}
    
