<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SliderTable extends Migration
{

   public function up()
    {
        Schema::create('slider', function (Blueprint $table) {
           
            $table->increments('id');
            $table->string('src_imagen',255);
            $table->string('src_image_mobile',255)->nullable();    
            $table->string('titulo',60)->nullable();
            $table->string('texto',255)->nullable();
            $table->integer('num_orden')->nullable();
            $table->boolean('show')->default(true);
            $table->string('btn_titulo',60)->nullable();
            $table->string('btn_link',60)->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('slider');
    }
}
