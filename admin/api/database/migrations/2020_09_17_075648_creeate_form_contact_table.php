<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreeateFormContactTable extends Migration
{
    public function up()
    {
        Schema::create('form_contact', function (Blueprint $table) {

            $table->increments('id');
            
            $table->string('name',255)->nullable();
            
            $table->string('city',255)->nullable();
            
            $table->string('phone',20)->nullable();

            $table->string('email',100)->unique();

            $table->string('comment',255)->nullable();
            
            $table->timestamps();
            
            $table->softDeletes();
            
        });  
    }

    public function down()
    {
        Schema::dropIfExists('form_contact');
    }
}
