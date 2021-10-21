<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessLogos extends Model
{
    use SoftDeletes;

    protected $table =  'business_logos';
    
    protected $fillable = [

        'image','business_id'
    
    ]; 

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = []; 

    public function business() {

		return $this->belongsTo(Business::class);
    }
    
    public static $getdata = [];

    public static $alldata = [];

    public static $deletes = [];
    
    public static $sort_order = ['nombre'];

}
