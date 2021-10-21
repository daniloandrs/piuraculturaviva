<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessEmail extends Model
{
    use SoftDeletes;

    protected $table = 'business_email';
    
    protected $fillable = [

        'email','business_id'
    
    ]; 

    protected $casts = [];

    public static $rules = [

        'email'       => 'nullable',
        'business_id' => 'required'
    
    ];
    
    protected static $messages = []; 

    public function business () {

		return $this->belongsTo(Business::class);
    }
    
    public static $getdata = [];

    public static $alldata = [];

    public static $deletes = [];
    
    public static $sort_order = ['email','asc'];

}
