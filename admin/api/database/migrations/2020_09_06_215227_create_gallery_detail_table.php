<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGalleryDetailTable extends Migration
{
    public function up()
    {
        Schema::create('gallery_detail', function (Blueprint $table) {
           
            $table->increments('id');
            
            $table->string('url_image',255);
            
            $table->string('description',255)->nullable();

            $table->integer('gallery_id')->unsigned()->index()->nullable();
            
            $table->foreign('gallery_id')->references('id')->on('gallery')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gallery_detail');
    }
}
   