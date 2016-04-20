<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class play_player extends Model
{
    protected $table = 'play_player';
    
    public function play() {
        return $this->belongsTo('app\play', 'play_id', 'play_id');
    }
    
    public function player() {
        return $this->belongsTo('app\player', 'player_id', 'player_id');
    }
    
    public function drive() {
        return $this->belongsTo('app\drive', 'drive_id', 'drive_id');
    }
    
    public function game() {
        return $this->belongsTo('app\game', 'gsis_id', 'gsis_id');
    }
    
    public function team() {
        return $this->belongsTo('app\team', 'team', 'team_id');
    }
    


}
