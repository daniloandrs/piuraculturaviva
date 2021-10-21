<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubCategoryMemberTable extends Migration
{

    public function up()
    {
        Schema::create('sub_category_member', function (Blueprint $table) {
           
            $table->increments('id');
            
            $table->integer('sub_category_id')->unsigned()->index()->nullable();
            
            $table->foreign('sub_category_id')->references('id')->on('sub_category')->onDelete('cascade');
            
            $table->integer('member_id')->unsigned()->index()->nullable();
            
            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');
            

            $table->timestamps();
            
            $table->softDeletes();

        });
    }

  
    public function down()
    {
        Schema::dropIfExists('category_member');
    }
}
