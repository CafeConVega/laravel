<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class play extends Model
{
    protected $table = 'play';
     protected $primaryKey = 'play_id';
    public function agg_play() {
        return $this->hasOne('App\agg_play', 'play_id', 'play_id');
    } 
    
    public function play_player() {
        return $this->hasMany('App\play_player', 'play_id', 'play_id');
    } 
    
    public function drive() {
        return $this->belongsTo('App\drive', 'drive_id', 'drive_id');
    }
    
     public function game() {
        return $this->belongsTo('App\game', 'gsis_id', 'gsis_id');
    }
    
    public function team() {
        return $this->belongsTo('App\team', 'pos_team', 'team_id');
    }

    

}
