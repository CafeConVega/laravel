<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class game extends Model
{
    protected $table = 'game';
    protected $primaryKey = 'gsis_id';
    public function home_team() {
        return $this->belongsTo('app\team', 'home_team', 'team_id');
    }
    
    public function away_team() {
        return $this->belongsTo('app\team', 'away_team', 'team_id');
    }
    
    public function drive() {
        return $this->hasMany('app\drive', 'gsis_id', 'gsis_id');
    }
    
    public function play() {
        return $this->hasMany('app\play', 'gsis_id', 'gsis_id');
    }
    
    public function play_player() {
        return $this->hasMany('app\play_player', 'gsis_id', 'gsis_id');
    }
}
