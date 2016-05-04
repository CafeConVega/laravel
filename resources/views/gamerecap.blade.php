@extends('layouts.app')

@section('content')
<div class="row">       
<div class="dropdown hometeam">
  <button id="button_home_team" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Home Team<span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($teams as $teamss)
            <li data = "{{ $teamss->short}}" class="home_option" ><a>{{ $teamss->city." ".$teamss->name}}</a></li>
       @endforeach
  </ul>
</div>
<div class="dropdown year">
  <button id="button_year" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Year
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($years as $yearss)
            <li data = "{{$yearss->season_year}}" class="season_option"><a>{{ $yearss->season_year }}</a></li>
       @endforeach
  </ul>
</div>
<div class="dropdown awayteam">
  <button id="button_away_team" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Away Team
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($teams as $teamss)
            <li data = "{{ $teamss->short}}" class = "away_option"><a>{{ $teamss->city." ".$teamss->name}}</a></li>
       @endforeach
  </ul>
</div>
<button id="searchbutton" class="btn btn-success" type="button">Go</button>
</div>
<script>
    var home, year, away;
d3.selectAll(".home_option").on("click", function () {
    home = d3.select(this).attr("data");
    d3.select("#button_home_team").text(home);
});

d3.selectAll(".away_option").on("click", function () {
    away = d3.select(this).attr("data");
    d3.select("#button_away_team").text(away);
    
});
    
d3.selectAll(".season_option").on("click", function () {
    year = d3.select(this).attr("data");
    d3.select("#button_year").text(year);
});
    
    
d3.select("#searchbutton").on("click", function () {
    if(home && year && away) {
        init(home, year, away);
    } else{
        alert("Make sure a home team, year, and away team have been selected");
    } 
});
    
var fullwidth = Math.round(window.innerWidth * .75);
var fullheight = Math.round(window.innerHeight * .6);

//Use to make charts responsive
d3.select(window).on('resize', function (){
//    console.log("Width & Height", fullwidth+" "+fullheight);
});

var d3tooltip = d3.select("body")
            .append("div")
            .attr("class", "d3tooltip");

var zero = d3.format("04d"); //Used to add leading zeros to play_id to make all numbers the same length

var date_format = d3.time.format("%c");

var data;
        
var quarters = ["Q1", "Q2", "Q3", "Q4"];
        
var teams = {}, passing_data = {};
    
var fieldsForTables = {
    passing: {fields:["team","player_id","passing_yds","passing_att","passing_cmp","completion_percentage",
                       "passing_yds_per","passing_tds","passing_int", "passing_sk","fumbles_tot"],
                labels: ["Team","Player","Yards","Pass Attempts", "Pass Completions", "Compl. %", "Avg. Yards","Touchdowns", "Interceptions","Sacks", "Fumbles"],
                sort_type: ["string","string","float","float", "float", "float", "float","float", "float","float", "float"]
             },
    
    receiving: {fields: ["team","player_id","receiving_tar", "receiving_rec", "receiving_yds", "receiving_avg","receiving_tds", "fumbles_tot"],
                labels: ["Team","Player","Targets", "Receptions", "Yards", "Avg. Yards", "Touchdowns", "Fumbles"],
                sort_type:["string","string","float", "float", "float", "float", "float", "float"]
               },
    
    rushing: {fields: ["team","player_id","rushing_att", "rushing_yds", "rushing_avg", "rushing_tds","fumbles_tot"],
              labels: ["Team","Player","Carries", "Yards", "Avg. Yds","Touchdowns", "Fumbles"],
            sort_type: ["string","string","float", "float", "float", "float", "float"]}
    };
    
    
function init(home, year, away){
    
//Load in contents of CSV file
        
//$.getJSON( "http://104.236.249.26/game/2015102502",function (error, data) {
//    if(error) {
//        console.log("error", error);
//    }
//    
//    console.log("data", data);
//});
        
d3.json("http://104.236.249.26/"+home+"/"+year+"/"+away, function (error, data_load) {
    if(error) {
        console.log("error", error);
    }
    
    console.log("data", data_load);

    data = data_load;
    
    data.drives.sort(function (a, b) {
					return a.drive_id - b.drive_id;
				});
    data.plays.sort(function (a, b) {
					return a.play_id - b.play_id;
				});
    data.play_player.sort(function (a, b) {
					return a.play_id - b.play_id;
				});
    
    data.play_player.forEach(function(d){
        data.plays.forEach(function(e){
            if(d.play_id == e.play_id){
                d.quarter = e.time.toString().substring(1, 3);
            }
        });   
    });
    
    gameInfo();
    
    clickers();
    
    makeCharts();   

}); //end d3.csv
    
function clickers(){
    var quarters =["q1", "q2", "q3", "q4"];
    
    quarters.forEach(function(d){
        makeClickersWork(d);
    });
    
    function makeClickersWork(qtr) {
        d3.select("button#"+qtr+"_pass").classed("selected", true);
        var whichbutton = qtr+"_pass";
        //Use buttons for year selection
        d3.selectAll("button."+qtr+"_clicker").on("click", function () {

            whichbutton = d3.select(this).attr("id");

            d3.select(this).classed("selected", true);

             if (whichbutton === qtr+"_pass") {

                d3.select("button#"+qtr+"_rec").classed("selected", false);
                d3.select("button#"+qtr+"_rush").classed("selected", false);
                d3.select("button#"+qtr+"_pbp").classed("selected", false);
                d3.select("h2#"+qtr+"_action").text(qtr+" Passing");

                d3.selectAll("."+qtr+".action").classed("hidden", true);
                d3.select("."+qtr+".passing.action").classed("hidden", false);

            }

            if (whichbutton === qtr+"_rec") {

                d3.select("button#"+qtr+"_pass").classed("selected", false);
                d3.select("button#"+qtr+"_rush").classed("selected", false);
                d3.select("button#"+qtr+"_pbp").classed("selected", false);
                d3.select("h2#"+qtr+"_action").text(qtr+" Receiving");

                d3.selectAll("."+qtr+".action").classed("hidden", true);
                d3.select("."+qtr+".receiving.action").classed("hidden", false);

            }

            if (whichbutton === qtr+"_rush") {

                d3.select("button#"+qtr+"_pass").classed("selected", false);
                d3.select("button#"+qtr+"_rec").classed("selected", false);
                d3.select("button#"+qtr+"_pbp").classed("selected", false);
                d3.select("h2#"+qtr+"_action").text(qtr+" Rushing");

                d3.selectAll("."+qtr+".action").classed("hidden", true);
                d3.select("."+qtr+".rushing.action").classed("hidden", false);

            }

             if (whichbutton === qtr+"_pbp") {

                d3.select("button#"+qtr+"_pass").classed("selected", false);
                d3.select("button#"+qtr+"_rec").classed("selected", false);
                d3.select("button#"+qtr+"_rush").classed("selected", false);
                d3.select("h2#"+qtr+"_action").text(qtr+" Play-By-Play");

                d3.selectAll("."+qtr+".action").classed("hidden", true);
                d3.select("."+qtr+".pbp.action").classed("hidden", false);

            }

        });//end of clicker
    }
}
    
function clickersSafety(qtr){
    d3.select("button#"+qtr+"_pass").classed("selected", true);
    var whichbutton = qtr+"_pass";
    //Use buttons for year selection
    d3.selectAll("button."+qtr+"_clicker").on("click", function () {

        whichbutton = d3.select(this).attr("id");

        console.log(whichbutton);

        d3.select(this).classed("selected", true);

         if (whichbutton === qtr+"_pass") {

            d3.select("button#q1_rec").classed("selected", false);
            d3.select("button#q1_rush").classed("selected", false);
            d3.select("button#q1_pbp").classed("selected", false);
            d3.select("h2#q1_action").text("Q1 Passing");

            d3.selectAll(".q1.action").classed("hidden", true);
            d3.select(".q1.passing.action").classed("hidden", false);

        }

        if (whichbutton === "q1_rec") {

            d3.select("button#q1_pass").classed("selected", false);
            d3.select("button#q1_rush").classed("selected", false);
            d3.select("button#q1_pbp").classed("selected", false);
            d3.select("h2#q1_action").text("Q1 Receiving");

            d3.selectAll(".q1.action").classed("hidden", true);
            d3.select(".q1.receiving.action").classed("hidden", false);

        }

        if (whichbutton === "q1_rush") {

            d3.select("button#q1_pass").classed("selected", false);
            d3.select("button#q1_rec").classed("selected", false);
            d3.select("button#q1_pbp").classed("selected", false);
            d3.select("h2#q1_action").text("Q1 Rushing");

            d3.selectAll(".q1.action").classed("hidden", true);
            d3.select(".q1.rushing.action").classed("hidden", false);

        }

         if (whichbutton === "q1_pbp") {

            d3.select("button#q1_pass").classed("selected", false);
            d3.select("button#q1_rec").classed("selected", false);
            d3.select("button#q1_rush").classed("selected", false);
            d3.select("h2#q1_action").text("Q1 Play-By-Play");

            d3.selectAll(".q1.action").classed("hidden", true);
            d3.select(".q1.pbp.action").classed("hidden", false);

        }

    });//end of clicker
}
    
function makeCharts() {
passingData();
var quarters =["q1", "q2", "q3", "q4"];
    
var QUARTERS =["Q1", "Q2", "Q3", "Q4"];
    
quarters.forEach(function(d,i){
    QUARTERS.forEach(function(a, b){
        if(i == b){
            quarterChart(quarters[i], QUARTERS[b]);
        }
    });
});
    
    function quarterChart(q, Q){
        
        fieldGraph("#"+q+"graphic", Q);
        
        passingGraph(q);
        makeTable("passing", Q, "#"+q+"_table_pass");

        makeTable("receiving", Q, "#"+q+"_table_rec");
        makeBarChart("#"+q+"_chart_rec", "receiving", Q, "Yards");

        makeTable("rushing", Q, "#"+q+"_table_rush");
        makeBarChart("#"+q+"_chart_rush", "rushing", Q, "Yards");
    }
    
    
}
    
}
</script>
@endsection
