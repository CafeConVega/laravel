<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class agg_play extends Model
{
    protected $table = 'agg_play';
    
      public function play() {
        return $this->belongsTo('app\play', 'play_id', 'play_id');
    } 
}
