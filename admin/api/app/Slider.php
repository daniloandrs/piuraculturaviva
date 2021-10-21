<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Slider extends Model
{ 
    use SoftDeletes;
    
    protected $table =  'slider';

    protected $fillable = [
        'src_imagen',
        'titulo',
        'texto',
        'num_orden',
        'show',
        'btn_titulo',
        'btn_link',
        'src_image_mobile'
    ];

    protected $hidden = ['created_at','updated_at','deleted_at'];

    protected $casts = [
        'show' => 'boolean',
        'titulo' => 'string',
        'texto' => 'string',
        'num_orden' => 'integer'
    ];

    public static $rules = [
        'num_orden' => 'nullable' 
    ];

    protected static $messages = [
        
    ];

    public static $getdata = [];

    public static $alldata = [];
    public static $deletes = [];
    public static $sort_order = ['num_orden','asc'];

}
