<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photo extends Model
{
    use SoftDeletes;
    
    protected $table =  'photo';

    protected $fillable = 
    [
        'url', 
        'member_id',
        'description'
    ];

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public function member () {

		  return $this->belongsTo(Member::class);
    
    }

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = [];
}
