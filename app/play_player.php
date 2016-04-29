<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class play_player extends Model
{
    protected $table = 'play_player';
    
    public function play() {
        return $this->belongsTo('App\play', 'play_id', 'play_id');
    }
    
    public function player() {
        return $this->belongsTo('App\player', 'player_id', 'player_id');
    }
    
    public function drive() {
        return $this->belongsTo('App\drive', 'drive_id', 'drive_id');
    }
    
    public function game() {
        return $this->belongsTo('App\game', 'gsis_id', 'gsis_id');
    }
    
    public function team() {
        return $this->belongsTo('App\team', 'team', 'team_id');
    }
    
    public function teamPlus() {
        return $this->belongsTo('App\team_plus', 'team', 'team_id');
    }
    


}
