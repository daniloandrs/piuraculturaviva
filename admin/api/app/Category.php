<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    const CATEGORY_TYPE_MEMBER = 2;

    const CATEGORY_TYPE_POST = 1;

    protected $table =  'category';

    protected $fillable = [ 'name','tag_name','color','category_type_id']; 
    
    public static $rules = [
        'name'      => 'required',
        'tag_name'  => 'nullable',
        'color'     => 'nullable',
        'category_type_id' => 'required'
    ];

    protected static $messages = [];

    public function category_type() {

        return $this->belongsTo(CategoryType::class);
    }  

    public function event () {

        return $this->hasMany(Event::class);
    }


    public function sub_category () {

        return $this->hasMany(SubCategory::class);
    
    }

    /*
    public function member () {
    
        return $this->belongsToMany(Member::class,'category_member')->withTimestamps();
    
    }*/

    public function post () {
    
        return $this->belongsToMany(Post::class,'category_post')->withTimestamps();
    
    }

    public static $getdata = ['category_type'];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['name','asc'];

}
