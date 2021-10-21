<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGalleryTable extends Migration
{
    public function up()
    {
        Schema::create('gallery', function (Blueprint $table) {
           
            $table->increments('id');
            $table->string('url_image',255);
            $table->string('title',255)->nullable();
            $table->string('description',255)->nullable();
            $table->integer('num_orden')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gallery');
    }
}
