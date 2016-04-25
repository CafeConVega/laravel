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
    
    public function allTeams() {
        $teams = nflteams::all();
        return view('frontend.nfl', ["teams" => $teams]);
}
    
     public function teamsJson() {
        $teams = nflteams::all();
        return response()->json($teams);
    }  
    
    public function gameJSON($id) {
        $gameid = game::find($id);
        $alldata = array();
        $game_data = array();
        $drives = array();
        $plays = array();
        $players = array();
        $play_players = array();
        
//        foreach($gameid->game as $game) {
//            $obj = new \stdClass;
//            $obj = $game;
//            $game_data[] = $obj;    
//        } 
        
        foreach($gameid->play as $play) {
//            $plays[] = $play;
            $obj = new \stdClass;
            $obj = $play;
//            $obj->player = $play->player;
//            $play->player
            $plays[] = $obj;    
        }
        foreach($gameid->drive as $drive) {
            $obj = new \stdClass;
            $obj = $drive;
            $drives[] = $obj;    
        }
        
        foreach($gameid->play_player as $play_player) {
            $returnedObject = new \stdClass;
            $returnedObject = $play_player;
//            $players = $play_player.'player_id';
//            $returnedObject->player->plays = $play_player->plays;
//            $play_players[] = ["player" => $play_player, "plays" => $play_player->plays];
            $play_players[] = $returnedObject;
        }
        $alldata =  ["game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players];
        return response()->json($alldata);
    }
    
    public function gameJSONtest($id) {
        $game_id = game::find($id);
        $alldata = array();
        $game_data = array();
        $drives = array();
        $plays = array();
        $players_id = play_player::select('player_id')->groupBy('player_id')->where('gsis_id', '=', $id)->toArray();
        $players_data = player::whereIn('player_id', $players_id)->get();
        
        
        $players = array();
        $play_players = array();
        
//        foreach($game_id->game as $game) {
//            $obj = new \stdClass;
//            $obj = $game;
//            $game_data[] = $obj;    
//        } 
        
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
//            $players = $play_player.'player_id';
//            $returnedObject->player->plays = $play_player->plays;
//            $play_players[] = ["player" => $play_player, "plays" => $play_player->plays];
            $play_players[] = $obj;
        }
        
        foreach($players_data->player as $player) {
            $obj = new \stdClass;
            $obj = $player;
            $players[] = $obj;
        }
        
        $alldata =  ["game" =>$game_data, "drives" =>$drives, "plays" =>$plays, "play_player" => $play_players, "players" => $players];
        
        return response()->json($alldata);
    }


    

}
