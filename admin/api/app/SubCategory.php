<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubCategory extends Model {

    use SoftDeletes;

    protected $table =  'sub_category';

    protected $fillable = [ 'name','category_id']; 
    
    public static $rules = [
        'name'        => 'required',
        'category_id' => 'required'
    ];

    protected static $messages = [];

    public function category () {

        return $this->belongsTo(Category::class);

    }

    public function event () {

        return $this->belongsTo(Event::class);

    }

    public function member () {
    
        return $this->belongsToMany(Member::class,'sub_category_member')->withTimestamps();
    
    }

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['name','asc'];
}
   