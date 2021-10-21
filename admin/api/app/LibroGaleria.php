<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LibroGaleria extends Model
{
    use SoftDeletes;
    
    protected $table =  'libro_galeria';

    protected $fillable = 
    [
        'src',
        'show',
        'libro_id'
    ];

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public function libro () {

		return $this->belongsTo(Libro::class);
    
    }
    
    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['show'];
}
