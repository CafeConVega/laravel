<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    public function question() {
	return $this->hasOne('App\Question');
}
    
    public function answer() {
	return $this->hasOne('App\Answer');
}
}
