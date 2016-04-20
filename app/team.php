<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class team extends Model
{
    protected $table = 'team';
    
    public function home_team() {
        return $this->hasMany('app\game', 'home_team', 'team_id');
    }
    
    public function away_team() {
        return $this->hasMany('app\game', 'away_team', 'team_id');
    }
    
    public function drive() {
        return $this->hasMany('app\drive', 'pos_team', 'team_id');
    }
    
    public function player() {
        return $this->hasMany('app\player', 'team', 'team_id');
    }
    
     public function play_player() {
        return $this->hasMany('app\play_player', 'team', 'team_id');
    }
    
     public function play() {
        return $this->hasMany('app\play', 'pos_team', 'team_id');
    }
}
