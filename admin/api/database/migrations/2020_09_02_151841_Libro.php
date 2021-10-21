<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Libro extends Migration
{
    public function up()
    {
        Schema::create('libro', function (Blueprint $table) {
            
            $table->increments('id');
            
            $table->string('key_post',200)->unique();
            
            $table->string('title',200)->nullable();

            $table->boolean('show')->default(true);

            $table->string('background_image',200)->nullable();

            $table->string('background_image_mobile',200)->nullable();

            $table->longText('description')->nullable();

            $table->timestamps();
            
            $table->SoftDeletes();

        });
    }

    public function down()
    {
        Schema::dropIfExists('libro');
    }
    
}
