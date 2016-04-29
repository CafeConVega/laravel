<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class player extends Model
{
    protected $table = 'player';
    protected $primaryKey = 'player_id';
    
     public function team() {
        return $this->belongsTo('App\team', 'team', 'team_id');
    }
    
    public function teamPlus() {
        return $this->belongsTo('App\team_plus', 'team', 'team_id');
    }
    
    public function play_player() {
        return $this->hasMany('App\play_player', 'player_id', 'player_id');
    }
}
