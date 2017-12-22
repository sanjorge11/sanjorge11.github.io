$(document).ready(function () {
    //var north = new TextPlayer("Alice", $("#north_player")[0], $("#player-action1")[0]);
    var north = new TextPlayer("Alice", $("#north_player")[0]);
	
    var east = new DumbAI("Bob", $("#player-action2")[0])
    var south = new DumbAI("Carol", $("#player-action3")[0]);
    var west = new DumbAI("David", $("#player-action4")[0]);

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});

