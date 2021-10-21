<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Libro extends Model {

    use SoftDeletes;
    
    protected $table =  'libro';

    const MY_BOOK_KEY = 'my_book';

    protected $fillable = [
      'show',
      'title',
      'key_post',
      'options', 
      'description',
      'background_image',
      'background_image_mobile',
        
    ];

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public function libro_galeria () {

		return $this->hasMany(LibroGaleria::class);
    
    }
    
    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['show'];

}
