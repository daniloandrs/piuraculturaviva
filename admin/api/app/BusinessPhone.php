<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessPhone extends Model {

    use SoftDeletes;

    protected $table =  'business_phone';
    
    protected $fillable = [

        'phone','business_id'
    
    ]; 
 
    protected $casts = [];

    public static $rules = [

        'phone' => 'required',
        
        'business_id' => 'required',
    
    ];
    
    protected static $messages = []; 

    public function business () {

		return $this->belongsTo(Business::class);
    
    }
    
    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];
    
    public static $sort_order = ['phone','asc'];

}
