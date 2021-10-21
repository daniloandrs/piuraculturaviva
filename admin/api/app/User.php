<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Beli\Roles\Models\Rol;
use Beli\Auth\Models\Token;
use App\Persona;

class User extends Authenticatable
{
    use Notifiable;
    use SoftDeletes;

    protected $table = 'users';
    protected $fillable = ['nick', 'email','password','profile_image','remember_token'];
    protected $hidden = ['password', 'remember_token','pivot'];


    public static $rules = [
        'nick' => 'required|max:50||unique:users',
        'email' => 'required|max:100|unique:users',
        'password' => 'required'
    ];


    public static $messages = [
        'nick.unique' => 'Este nombre de usuario ya se encuentra registrado.',
        'email.unique' => 'Ya existe una persona registrada con este email.',
    ];

    public static $getdata = ['roles'];
    public static $alldata = ['roles'];
    public static $deletes = [];
    public static $sort_order = ['nick','asc'];

    public function roles()
    {
        return $this->belongsToMany(Rol::class);
    }
    public function tokens()
    {
        return $this->hasMany(Token::class);
    }
     
    public function persona()
    {
        return $this->hasOne(Persona::class);
    }

    public function afinidades()
    {
        return $this->hasMany(Afinidad::class);
    }



}
