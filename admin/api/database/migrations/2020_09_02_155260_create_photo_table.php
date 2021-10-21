<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotoTable extends Migration
{

    public function up()
    {
        Schema::create('photo', function (Blueprint $table) {
            
            $table->increments('id');
            
            $table->string('url',255)->nullable();

            $table->string('description',255)->nullable();

            $table->integer('member_id')->unsigned()->index()->nullable();
            
            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->SoftDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('photo');
    }
}
