<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBusinessEmailTable extends Migration
{
    public function up() {

        Schema::create('business_email', function (Blueprint $table) {
            
            $table->increments('id');
            
            $table->string('email',255);
            
            $table->integer('business_id')->unsigned()->index()->nullable();
            
            $table->foreign('business_id')->references('id')->on('business')->onDelete('cascade');

            $table->timestamps();
            
            $table->softDeletes();

        });
    }

    public function down() {
        
        Schema::dropIfExists('business_email');
    }
}
