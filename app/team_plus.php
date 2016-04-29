<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class team_plus extends Model
{
    protected $table = 'team_plus';
    protected $primaryKey = 'team_id';
    
    public function home_team() {
        return $this->hasMany('App\game', 'home_team', 'team_id');
    }
    
    public function away_team() {
        return $this->hasMany('App\game', 'away_team', 'team_id');
    }
    
    public function drive() {
        return $this->hasMany('App\drive', 'pos_team', 'team_id');
    }
    
    public function player() {
        return $this->hasMany('App\player', 'team', 'team_id');
    }
    
     public function play_player() {
        return $this->hasMany('App\play_player', 'team', 'team_id');
    }
    
     public function play() {
        return $this->hasMany('App\play', 'pos_team', 'team_id');
    }
}
