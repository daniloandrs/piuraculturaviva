<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Persona extends Model
{
    use SoftDeletes;

    protected $table    =  'persona';
    protected $hidden   = ['created_at','updated_at','deleted_at'];

    protected $fillable = [ 
        'nombres',
        'apellidos',
        'dni',
        'email',
        'direccion',
        'user_id'
    ];

    protected $appends = [];

    protected $casts = [
        'email' => 'string'
    ];

    //Arquitectura
    public static $rules = [
        'nombres' => 'required',
        'apellidos' => 'required',
        'dni' => 'required|size:8|unique:persona',
        'email'=> 'required|unique:persona',
    ]; 

    public static $messages = [
        'dni.unique' => 'Ya existe una persona registrada con este número de dni.',
        'email.unique' => 'Ya existe una persona registrada con este email.',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    

    public static $getdata = [];

    public static $alldata = [];
    public static $deletes = [];
    public static $sort_order = ['id','DESC'];

}
