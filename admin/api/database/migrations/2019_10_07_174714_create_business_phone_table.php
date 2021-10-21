<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBusinessPhoneTable extends Migration
{
    public function up()
    {
        Schema::create('business_phone', function (Blueprint $table) {
            
            $table->increments('id');

            $table->string('phone',50)->nullable();

            $table->integer('business_id')->unsigned()->index()->nullable();
            
            $table->foreign('business_id')->references('id')->on('business')->onDelete('cascade');

            $table->timestamps();
            
            $table->softDeletes();

        });
    }

    public function down()
    {
        Schema::dropIfExists('business_phone');
    }
}
