<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class drive extends Model
{
    protected $table = 'drive';
    
     public function team() {
        return $this->belongsTo('App\team', 'pos_team', 'team_id');
    }
    
      public function game() {
        return $this->belongsTo('App\game', 'gsis_id', 'gsis_id');
    }
    
     public function play_player() {
        return $this->hasMany('App\play_player', 'drive_id', 'drive_id');
    }
    
    public function play() {
        return $this->hasMany('App\play', 'drive_id', 'drive_id');
    }
    
}
