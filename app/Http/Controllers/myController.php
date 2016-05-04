<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Question;
use App\nflteams;
use App\game;
use App\play;
use App\play_player;
use App\player;
use App\team_plus;

class myController extends Controller
{
    public function index() {
        $obj = new \stdClass();
    	$obj->firstName = "Josh";
    	$obj->lastName = "Vega";

        return view ('frontend.hello', ["obj" => $obj]);
    }
    
    public function gotWhatever(Request $request) {
    	$obj = new \stdClass();
    	$obj->firstName = $request->input('whatever');;
    	$obj->lastName = "Stuff";
    	return view('frontend.hello', ["obj" => $obj]);
    }
    
    public function questions() {
    	$questions = Question::all();
    	return view('frontend.questions', ["questions" => $questions]);
    }
    
    public function new_question(Request $request) {
    	$question = new Question;
    	$question->question = $request->question;
    	$question->points = $request->points;
    	$question->question_type = 1;
    	$question->quiz_id = 1;
    	$question->save(); 
    	$questions = Question::all();
    	return view('frontend.questions', ["questions" => $questions]);
}   

public function newTeam(Request $request) {
    	$team = new nflteams;
        
        $team->city = $request->input('city');
        $team->state = $request->input('state');
        $team->name = $request->input('name');
        $team->stadium = $request->input('stadium');
        $team->conference = $request->input('conference');
        $team->division = $request->input('division');
        $team->color_primary = $request->input('color_primary');
        $team->color_secondary = $request->input('color_secondary');
        $team->color_alternate = $request->input('color_alternate');
        $team->save();
        $teams = nflteams::all();
        return view('frontend.nfl', ["teams" => $teams]);
 }
    
public function buttonData() {
        $teams = team_plus::all()->orderBy('short')->groupBy('short')->get();
        $years = game::select('season_year')->orderBy('season_year')->distinct()->get();
        $all_data = ["teams" => $teams, "years" => $years];
        return view('gamerecap', $all_data);
}
    
//public function allYears() {
//        $years = game::select('season_year')->distinct()-get();
//        return view('select_game', ["years" => $years]);
//}
    
//public function filterTeams(Request $request) {
//        $teamsFilter = $request->;
//        return view('select_game', ["teams" => $teams]);
//}
    
     public function teamsJson() {
        $teams = nflteams::all();
        return response()->json($teams);
    }  
    
    public function gameJSON($id) {
       $game_id = game::find($id);
        $alldata = array();
        $drives = array();
        $plays = array();
        $players = array();
        $play_players = array();
        
        $game_data = game::find($id);
        $players_id = play_player::select('player_id')->where('gsis_id', '=', $id)->distinct()->get();
        $players_data = player::whereIn('player_id', $players_id)->get();
        
        $home_team = $game_data->home_team;
        $away_team = $game_data->away_team;
        $teams = array($away_team, $home_team);
        $teams_data = team_plus::whereIn('team_id', $teams)->get();
        
        foreach($game_id->play as $play) {
            $obj = new \stdClass;
            $obj = $play;
            $plays[] = $obj;    
        }
        foreach($game_id->drive as $drive) {
            $obj = new \stdClass;
            $obj = $drive;
            $drives[] = $obj;    
        }
        
        foreach($game_id->play_player as $play_player) {
            $obj = new \stdClass;
            $obj = $play_player;
            $play_players[] = $obj;
        }
        
        $alldata =  ["teams" => $teams_data, "game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players_data];
        
        return response()->json($alldata);
    }
    
    public function gameJSONtest($id) {
        $game_id = game::find($id);
        $alldata = array();
        $drives = array();
        $plays = array();
        $players = array();
        $play_players = array();
        
        $game_data = game::find($id);
        $players_id = play_player::select('player_id')->where('gsis_id', '=', $id)->distinct()->get();
        $players_data = player::whereIn('player_id', $players_id)->get();
        
        $home_team = $game_data->home_team;
        $away_team = $game_data->away_team;
        $teams = array($away_team, $home_team);
        $teams_data = team_plus::whereIn('team_id', $teams)->get();

        
//        $teams_obj = new \stdClass;
//        $teams_obj = $game_data->home_team;
//        $teams_obj = $game_data->away_team;
//        $teams = $teams_obj;
        
        foreach($game_id->play as $play) {
            $obj = new \stdClass;
            $obj = $play;
            $plays[] = $obj;    
        }
        foreach($game_id->drive as $drive) {
            $obj = new \stdClass;
            $obj = $drive;
            $drives[] = $obj;    
        }
        
        foreach($game_id->play_player as $play_player) {
            $obj = new \stdClass;
            $obj = $play_player;
            $play_players[] = $obj;
        }
        
        $alldata =  ["teams" => $teams_data, "game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players_data];
        
        return response()->json($alldata);
    }
    
    public function gameJsonData($id) {
       $game_id = game::find($id);
        $alldata = array();
        $drives = array();
        $plays = array();
        $players = array();
        $play_players = array();
        
        $game_data = game::find($id);
        $players_id = play_player::select('player_id')->where('gsis_id', '=', $id)->distinct()->get();
        $players_data = player::whereIn('player_id', $players_id)->get();
        
        $home_team = $game_data->home_team;
        $away_team = $game_data->away_team;
        $teams = array($away_team, $home_team);
        $teams_data = team_plus::whereIn('team_id', $teams)->get();
        
        foreach($game_id->play as $play) {
            $obj = new \stdClass;
            $obj = $play;
            $plays[] = $obj;    
        }
        foreach($game_id->drive as $drive) {
            $obj = new \stdClass;
            $obj = $drive;
            $drives[] = $obj;    
        }
        
        foreach($game_id->play_player as $play_player) {
            $obj = new \stdClass;
            $obj = $play_player;
            $play_players[] = $obj;
        }
        
        $alldata =  ["teams" => $teams_data, "game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players_data];
        
        return $alldata;
    }
    
    

public function getGame($home, $year, $away) {
        
    $game = game::where("away_team", "=", $away)
                    ->where("home_team", "=", $home)
                    ->where("season_year", "=", $year)->get();
        
    $game_id = $game[0]->gsis_id;
    
    function gameJsonData($id) {
       $game_id = game::find($id);
        $alldata = array();
        $drives = array();
        $plays = array();
        $players = array();
        $play_players = array();
        
        $game_data = game::find($id);
        $players_id = play_player::select('player_id')->where('gsis_id', '=', $id)->distinct()->get();
        $players_data = player::whereIn('player_id', $players_id)->get();
        
        $home_team = $game_data->home_team;
        $away_team = $game_data->away_team;
        $teams = array($away_team, $home_team);
        $teams_data = team_plus::whereIn('team_id', $teams)->get();
        
        foreach($game_id->play as $play) {
            $obj = new \stdClass;
            $obj = $play;
            $plays[] = $obj;    
        }
        foreach($game_id->drive as $drive) {
            $obj = new \stdClass;
            $obj = $drive;
            $drives[] = $obj;    
        }
        
        foreach($game_id->play_player as $play_player) {
            $obj = new \stdClass;
            $obj = $play_player;
            $play_players[] = $obj;
        }
        
        $alldata =  ["teams" => $teams_data, "game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players_data];
        
        return $alldata;
    }
    
    $data = gameJsonData($game_id);
    
    return response()->json($data);
        
//        var_dump($game);
 } 

    
public function getGameBU($team, $year, $opponent) {
        
        $away_games = game::where("away_team", "=",$team)->where("home_team", "=", $opponent)->get();
        $home_games = game::where("home_team", "=",$team)->where("away_team", "=", $opponent)-get();
        
        $all_games = array_merge($away_games, $home_games);
        
        $awayCheck = game::where("away_team", "like","%".$team."%");
        $homeCheck = game::where("home_team", "like","%".$team."%");
        
        if($awayCheck){
            $away = $team;
            $home = $opponent;
        }
        
        if($homeCheck){
            $away = $opponent;
            $home = $team;
        }
        
        $game = game::where("away_team", "like", "%".$away."%")
                    ->where("home_team", "like", "%".$home."%")
                    ->where("season_year", "=", $year)->get();
        
        $game_id = $game[0]->gsis_id;
        
        return response()->json($game_id);
        
//        var_dump($game);
 } 
    

}
