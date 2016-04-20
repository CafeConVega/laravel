<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class play extends Model
{
    protected $table = 'play';
    
    public function agg_play() {
        return $this->hasOne('app\agg_play', 'play_id', 'play_id');
    } 
    
    public function play_player() {
        return $this->hasMany('app\play_player', 'play_id', 'play_id');
    } 
    
    public function drive() {
        return $this->belongsTo('app\drive', 'drive_id', 'drive_id');
    }
    
     public function game() {
        return $this->belongsTo('app\game', 'gsis_id', 'gsis_id');
    }
    
    public function team() {
        return $this->belongsTo('app\team', 'pos_team', 'team_id');
    }

    

}
