<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class LibroGaleria extends Migration
{
    public function up()
    {
        Schema::create('libro_galeria', function (Blueprint $table) {
            
            $table->increments('id');
            
            $table->string('src',200);
            
            $table->boolean('show')->default(true);

            $table->integer('libro_id')->unsigned()->index()->nullable();
            
            $table->foreign('libro_id')->references('id')->on('libro')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->SoftDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('libro_galeria');
    }
}
