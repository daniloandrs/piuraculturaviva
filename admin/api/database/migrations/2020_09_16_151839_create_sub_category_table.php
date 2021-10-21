<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubCategoryTable extends Migration
{
    public function up()
    {
        Schema::create('sub_category', function (Blueprint $table) {
           
            $table->increments('id');
            
            $table->string('name',255)->nullable();
            
            $table->integer('category_id')->unsigned()->index()->nullable();
            
            $table->foreign('category_id')->references('id')->on('category')->onDelete('cascade');
            
            $table->timestamps();

            $table->softDeletes();
        });
    }


    public function down()
    {
        Schema::dropIfExists('sub_category');
    }
}
