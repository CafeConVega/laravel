<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Question;
use App\nflteams;

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

    

}
