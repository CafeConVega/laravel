<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class nflteams extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nflteams', function (Blueprint $newtable) {
            $newtable->increments('id');
            $newtable->string('city', 100);
            $newtable->string('state', 2);
            $newtable->string('name', 100);
            $newtable->string('stadium', 200);
            $newtable->string('conference', 3);
            $newtable->string('division', 5);
            $newtable->string('color_primary', 7);
            $newtable->string('color_secondary', 7);
            $newtable->string('color_alternate', 7);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        Schema::drop('nflteams');
    }
}
