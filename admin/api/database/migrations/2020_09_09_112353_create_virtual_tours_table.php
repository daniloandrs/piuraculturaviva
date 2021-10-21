<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVirtualToursTable extends Migration
{

    public function up()
    {
        Schema::create('virtual_tours', function (Blueprint $table) {
           
            $table->increments('id');

            $table->string('background_image',255)->nullable();
            
            $table->string('title',255)->nullable();
            
            $table->string('url',255)->nullable();
            
            $table->timestamps();
            
            $table->softDeletes();
        
        });
    }

    public function down()
    {
        Schema::dropIfExists('virtual_tours');
    }
}
