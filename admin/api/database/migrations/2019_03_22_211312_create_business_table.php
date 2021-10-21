<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBusinessTable extends Migration
{
    
    public function up()
    {
        Schema::create('business', function (Blueprint $table) {

            $table->increments('id');
            
            $table->string('business_name',255)->unique();
            
            $table->string('direction',255)->nullable();
            
            $table->string('web_site',255)->nullable();

            $table->string('contact_title',255)->nullable();

            $table->string('contact_description',255)->nullable();
            
            $table->timestamps();
            
            $table->softDeletes();
            
        });  
    }

    public function down()
    {
        Schema::dropIfExists('business');
    }
}
