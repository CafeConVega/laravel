<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
     public function question() {
        return $this->hasOne('App\Question');
 }
    
    public function students() {
	return $this->hasManyThrough('App\StudentAnswer', 'App\Student');
}
}
