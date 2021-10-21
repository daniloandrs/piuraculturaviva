<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    
    protected $table =  'event';

    protected $fillable = 
    [
        'publication_date', 
        'publication_time',
        'publication_date_end', 
        'publication_time_end',
        'title',
        'location',
        'description',
        'author',
        'event_type_id',   
        'visits',
        'url',
        'url_detail',
        'redirectTo',
        'category_id',
        'sub_category_id',
        'price',
        'background_image',
        'isLive', 
        'color'   
    ];
 
    protected $casts = [
        'isLive' => 'boolean',
        'category_id' => 'integer',
        'sub_category_id' => 'integer',
        'event_type_id' => 'integer'
    ];

    protected $appends = ['date_end_mutator'];

    public function getDateEndMutatorAttribute()
    {   
        return   Carbon::parse($this->publication_date_end)->format('Y-m-d');
        
    }  

    public function event_type () {

        return $this->belongsTo(EventType::class);
    }

    public function category () {

        return $this->belongsTo(Category::class);
    }

    public function sub_category () {

        return $this->belongsTo(SubCategory::class);
    }


    public static $rules = [];
    
    protected static $messages = [];

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = ['publication_date','desc'];
    
}