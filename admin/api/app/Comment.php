<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model {

    use SoftDeletes;  

    protected $table = 'comment';

    protected $fillable = [ 
        'name',
        'email',
        'content',
        'IP',
        'status',
        'model',
        'item_id',
        'date'
    ]; 
    
    public static $rules = [ 'name'   => 'required'];

    protected static $messages = [];

    public static $getdata = [];

    public static $alldata = [];

    public static $deletes = [];

    public static $sort_order = ['date','asc'];
}



