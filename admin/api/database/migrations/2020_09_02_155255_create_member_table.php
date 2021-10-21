<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMemberTable extends Migration
{

    public function up()
    {
        Schema::create('member', function (Blueprint $table) {
           
            $table->increments('id');
            
            $table->string('name',255)->nullable();
            
            $table->integer('visits')->default(0)->nullable();
            
            $table->string('logo',255)->nullable();
            
            $table->string('background_image',255)->nullable();
            
            $table->string('thumbnail',255)->nullable();
            
            $table->string('url',255)->nullable();
            
            $table->string('description',255)->nullable();
            
            $table->longText('about')->nullable();
            
            $table->string('address',255)->nullable();
            
            $table->string('phone',255)->nullable();
            
            $table->string('email',255)->nullable();
            
            $table->string('website',255)->nullable();
            
            $table->string('button_link',255)->nullable();
            
            $table->string('button_text',255)->nullable();
            
            $table->boolean('status')->default(true);
            
            $table->timestamps();
            
            $table->softDeletes();
        });
    }

  
    public function down()
    {
        Schema::dropIfExists('member');
    }
}
