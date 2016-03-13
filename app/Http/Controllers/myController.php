<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Question;
use App\nfl;

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

    
        public function newTeam() {
    	$team = new nflteams;
        
        $team->city = Input::get('city');
        $team->state = Input::get('state');
        $team->name = Input::get('name');
        $team->stadium = Input::get('stadium');
        $team->conference = Input::get('conference');
        $team->division = Input::get('division');
        $team->color_primary = Input::get('color_primary');
        $team->color_secondary = Input::get('color_secondary');
        $team->color_alternate = Input::get('color_alternate');
        return view('frontend.nfl', ["team" => $team]);
 }
    

    

}
