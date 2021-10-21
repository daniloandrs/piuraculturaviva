<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBusinessLogosTable extends Migration
{
    
    public function up()
    {
        Schema::create('business_logos', function (Blueprint $table) {
            
            $table->increments('id');

            $table->string('image',255);
            
            $table->integer('business_id')->unsigned()->index()->nullable();
            
            $table->foreign('business_id')->references('id')->on('business')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->softDeletes();
        
        });
    }

    public function down()
    {
        Schema::dropIfExists('business_logos');
    }
}
