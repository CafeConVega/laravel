function gameInfo () {

    d3.json("data/game_data2.json", function (error, data) {
        if(error) {
        console.log("error", error);
        }
    
    console.log("data", data);
         
        var home_team = d.game.home_team.toString();
        var away_team = d.game.away_team.toString();
        
        var home_score = +d.game.home_score;
        var away_score = +d.game.away_score;
        

    });

}