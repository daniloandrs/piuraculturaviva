<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryPostTable extends Migration
{
    public function up()
    {
        Schema::create('category_post', function (Blueprint $table) {
            
            $table->increments('id');
        
            $table->integer('post_id')->unsigned()->index()->nullable();
            
            $table->foreign('post_id')->references('id')->on('post')->onDelete('cascade');
            
            $table->integer('category_id')->unsigned()->index()->nullable();
            
            $table->foreign('category_id')->references('id')->on('category')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->SoftDeletes(); 

        });
    }

 
    public function down()
    {
        Schema::dropIfExists('category_post');
    }
}
