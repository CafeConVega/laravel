<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Quiz extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('quiz', function (Blueprint $table) {
$table->increments('id');
$table->integer('course_id');
$table->date('expires');
$table->string('name');
$table->integer('user_id');
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
