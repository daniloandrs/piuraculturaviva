<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class EventType extends Model {

    use SoftDeletes;  

    protected $table = 'event_type';

    protected $fillable = [ 'name']; 
    
    public static $rules = [
        'name' => 'required',
    ];


    public function event () {

        return $this->hasMany(Event::class);
    }

    protected static $messages = [];

    public static $getdata = [];

    public static $alldata = [];

    public static $deletes = [];

    public static $sort_order = ['name','asc'];
}
