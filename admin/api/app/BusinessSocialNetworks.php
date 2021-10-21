<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessSocialNetworks extends Model {

    use SoftDeletes;

    protected $table =  'business_social_networks';
    
    protected $fillable = [

        'name','icon','url','business_id'
    
    ]; 
 
    protected $casts = [
    ];

    public static $rules = [

        'name' => 'required',
        
        'icon' => 'required',
        
        'url'  => 'required',

        'business_id' => 'required'
    
    ];
    
    protected static $messages = []; 

    public function business () {

		return $this->belongsTo(Business::class);
    
    }
    
    public static $getdata = [];

    public static $alldata = [];

    public static $deletes = [];
    
    public static $sort_order = ['name','asc'];

}
