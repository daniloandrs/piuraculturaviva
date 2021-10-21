<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventTable extends Migration {

    public function up() { 

        Schema::create('event', function (Blueprint $table) {
            
            $table->increments('id');
 
            $table->string('title',255)->nullable();
            
            $table->string('author',255)->nullable();  
            
            $table->string('location',255)->nullable();  
            
            $table->string('description',255)->nullable();  
            
            $table->integer('visits')->default(0)->nullable();
            
            $table->string('url',255)->nullable();

            $table->string('url_detail',255)->nullable();

            $table->string('redirectTo',255)->nullable();
            
            $table->dateTime('publication_date')->nullable();
             
            $table->dateTime('publication_time')->nullable();

            $table->dateTime('publication_date_end')->nullable();
             
            $table->dateTime('publication_time_end')->nullable();
            
            $table->boolean('isLive')->default(false);
            
            $table->string('background_image',255)->nullable();
            
            $table->string('color',255)->nullable();
            
            $table->integer('event_type_id')->unsigned()->index()->nullable();
            
            $table->foreign('event_type_id')->references('id')->on('event_type')->onDelete('cascade');
            
            $table->integer('category_id')->unsigned()->index()->nullable();
            
            $table->foreign('category_id')->references('id')->on('category')->onDelete('cascade');
            
            $table->timestamps();   

            $table->softDeletes();
        
        });
    }


    public function down() {

        Schema::dropIfExists('event');
    }
}
