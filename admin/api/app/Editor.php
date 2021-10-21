<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Editor extends Model
{
    use SoftDeletes;

    protected $table    =  'editor';
    protected $hidden   = ['created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
        'title',
        'content',
    ];

    protected $appends = [];

    protected $casts = [];

    //Arquitectura
    public static $rules = [
        'title' => 'required',
        'content' => 'required',
    ];

    public static $messages = [];

    public static $getdata = [];

    public static $alldata = [];
    public static $deletes = [];
    public static $sort_order = ['id', 'DESC'];
}
