<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormContact extends Model
{
    use SoftDeletes;

    protected $table =  'form_contact';

    protected $fillable = ['name','city','phone','email','comment']; 
    
    public static $rules = [
        'name'    => 'required',
        'city'    => 'required',
        'phone'   => 'required',
        'email'   => 'required',
        'comment' => 'required',
    ];

    protected static $messages = [];

    public static $getdata = [];
    public static $alldata = [];
    public static $deletes = [];

    public static $sort_order = ['name','asc'];

}
