<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class game extends Model
{
    protected $table = 'game';
    protected $primaryKey = 'gsis_id';
    
    public function home_team() {
        return $this->belongsTo('App\team', 'home_team', 'team_id');
    }
    
    public function away_team() {
        return $this->belongsTo('App\team', 'away_team', 'team_id');
    }
    
    public function home_teamPlus() {
        return $this->belongsTo('App\team_plus', 'home_team', 'team_id');
    }
    
    public function away_teamPlus() {
        return $this->belongsTo('App\team_plus', 'away_team', 'team_id');
    }
    
    public function drive() {
        return $this->hasMany('App\drive', 'gsis_id', 'gsis_id');
    }
    
    public function play() {
        return $this->hasMany('App\play', 'gsis_id', 'gsis_id');
    }
    
    public function play_player() {
        return $this->hasMany('App\play_player', 'gsis_id', 'gsis_id');
    }
}
