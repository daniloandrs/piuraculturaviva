<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VirtualTours extends Model
{

    use SoftDeletes;
    
    protected $table =  'virtual_tours';

    protected $fillable = 
    [
        'url', 
        'title',
        'background_image',
    ];

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['title','desc'];
    
}
