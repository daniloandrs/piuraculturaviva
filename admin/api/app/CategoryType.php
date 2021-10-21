<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryType extends Model
{
    use SoftDeletes;

    protected $table =  'category_type';

    protected $fillable = [ 'name']; 
    
    public static $rules = [
        'name' => 'required',
    ];

    protected static $messages = [];

    public function category ()
    {
        return $this->hasMany(Category::class);
    }

    public static $getdata = [];
    public static $alldata = [];
    public static $deletes = [];

    public static $sort_order = ['name','asc'];
}
