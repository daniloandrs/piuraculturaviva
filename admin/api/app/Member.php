<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes;
    
    protected $table =  'member';

    protected $fillable = [
        'name',    
        'visits',
        'logo', 
        'background_image', 
        'thumbnail',
        'url',
        'description',
        'about',
        'address',
        'phone',
        'email',
        'website',
        'button_link',
        'button_text',
        'status',
        'facebook',
        'youtube',
        'instagram'
    ];

    /*
    public function category_member () {
        return $this->belongsToMany(Category::class,'category_member')->withTimestamps();
    }
    */

    public function sub_category_member () {
        return $this->belongsToMany(SubCategory::class,'sub_category_member')->withTimestamps();
    }

    public function photos () {

		return $this->hasMany(Photo::class);
    
    }

    protected $casts = [
        'status' => 'boolean'
    ];

    public static $rules = [];
    
    protected static $messages = [];
    
    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['show'];
}
