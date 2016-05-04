<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/oldwelcome', function () {
    return view('welcome');
});

Route::get('hello', 'myController@index')->name('sayhello');
Route::post('hello', 'myController@gotWhatever')->name('saidhello');

Route::get('questions', 'myController@questions')->name('questions');
Route::post('questions', 'myController@new_question')->name('new_question');

Route::get('nfl', 'myController@allTeams');

Route::post('nfl', 'myController@newTeam');

Route::get('json', 'myController@teamsJson')->name('tjson');

Route::get('game/{id}', 'myController@gameJSON')->name('gamejson');

Route::get('gametest/{id}', 'myController@gameJSONtest')->name('gamejsontest');



Route::get('select_game', 'myController@buttonData');
//Route::get('select_game', 'myController@allYears');
//Route::post('select_game', 'myController@filterTeams');

//Route::get('gamein/{team}/{year}/{opponent}', 'myController@getGame')->name('gameGet');

Route::get('/{home}/{year}/{away}', 'myController@getGame')->name('gameGet');



/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});

Route::group(['middleware' => 'web'], function () {
    Route::auth();

    Route::get('/home', 'HomeController@index');
});
