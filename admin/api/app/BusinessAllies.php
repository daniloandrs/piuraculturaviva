<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessAllies extends Model {

    use SoftDeletes;

    protected $table =  'business_allies';
    
    protected $fillable = [

        'name','url','logo','business_id'
    
    ]; 
 
    protected $casts = [];

    public static $rules = [

        'name' => 'required',
        
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