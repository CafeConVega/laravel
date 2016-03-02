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

Route::get('hello', 'myController@index')->name('sayhello');
Route::post('hello', 'myController@gotWhatever')->name('saidhello');

Route::get('questions', 'myController@questions')->name('questions');
Route::post('questions', 'myController@new_question')->name('new_question');

Route::get('nfl', function () {
    return view('frontend.nfl');
});

Route::post('nfl', 'myController@newTeam');



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
