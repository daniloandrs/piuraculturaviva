<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTable extends Migration
{

    public function up()
    {
        Schema::create('category', function (Blueprint $table) {
           
            $table->increments('id');
            
            $table->string('name',255)->nullable();
            
            $table->string('tag_name',255)->nullable();
            
            $table->string('color',255)->nullable();
            
            $table->integer('category_type_id')->unsigned()->index()->nullable();
            
            $table->foreign('category_type_id')->references('id')->on('category_type')->onDelete('cascade');
            
            $table->timestamps();

            $table->softDeletes();
        
        });
    }


    public function down()
    {
        Schema::dropIfExists('category');
    }
}
