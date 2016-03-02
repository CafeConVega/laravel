<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    public function quiz() {
        return $this->hasOne('App\Quiz');
    }

       public function answers() {
        return $this->hasMany('App\Answer');
    }
    
       public function student_answers() {
        return $this->hasMany('App\StudentAnswer');
    }
    
}
