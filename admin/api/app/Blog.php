<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use SoftDeletes;
      
    protected $table =  'blog';

    protected $fillable = 
    [
        'url', 
        'title',
        'author',
        'background_image',
        'visits',
        'content',
        'publication_date',
        'subtitle'
    ];


    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['publication_date','desc'];
}
