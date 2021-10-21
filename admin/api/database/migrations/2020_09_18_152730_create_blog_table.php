<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBlogTable extends Migration
{
    public function up()
    {
        Schema::create('blog', function (Blueprint $table) {
            
            $table->increments('id');
        
            $table->string('title',255)->nullable();
            
            $table->string('author',255)->nullable();

            $table->string('subtitle',255)->nullable();
            
            $table->string('background_image',255)->nullable();
            
            $table->integer('visits')->nullable();

            $table->longText('content')->nullable();

            $table->dateTime('publication_date')->nullable();
            
            $table->string('url',255);
            
            $table->timestamps();
               
            $table->SoftDeletes();  

        });
    }

 
    public function down()
    {
        Schema::dropIfExists('blog');
    }
}
