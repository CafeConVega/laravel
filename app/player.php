<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class player extends Model
{
    protected $table = 'player';
    
     public function team() {
        return $this->belongsTo('app\team', 'team', 'team_id');
    }
    
    public function play_player() {
        return $this->hasMany('app\play_player', 'player_id', 'player_id');
    }
}
