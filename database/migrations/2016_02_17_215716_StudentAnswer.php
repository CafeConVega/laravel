<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StudentAnswer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('student_answers', function (Blueprint $table) {
$table->increments('id');
$table->integer('question_id');
$table->integer('answer_id');
$table->integer('student_id');
$table->timestamps();
	});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
