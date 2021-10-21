<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
      
    protected $table =  'post';

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


    public function category_post () {
        return $this->belongsToMany(Category::class,'category_post')->withTimestamps();
    }

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public static $getdata = ['category_post'];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['publication_date','desc'];
}
