<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentTable extends Migration
{
    public function up()
    {
        Schema::create('comment', function (Blueprint $table) {
            
            $table->increments('id');
            
            $table->string('name',255)->nullable();

            $table->string('email',255)->nullable();

            $table->string('content',255)->nullable();
            
            $table->string('IP',255)->nullable();
            
            $table->boolean('status')->default(0)->nullable();
            
            $table->string('model',255);
            
            $table->integer('item_id')->nullable();
            
            $table->datetime('date')->nullable();

            $table->timestamps();
            
            $table->SoftDeletes(); 
  
        });
    }

 
    public function down()
    {
        Schema::dropIfExists('comment');
    }
}
