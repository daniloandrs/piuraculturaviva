<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventTypeTable extends Migration {

    public function up() {

        Schema::create('event_type', function (Blueprint $table) {
           
            $table->increments('id');

            $table->string('name',255);
            
            $table->timestamps();
            
            $table->softDeletes();
       
        });
    }

    public function down() {
        
        Schema::dropIfExists('event_type');
    }
}
