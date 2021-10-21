<?php  
namespace Beli\Roles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\User;

class Rol extends Model
{
	use SoftDeletes;

	protected $table = 'rol';
	protected $fillable = ['nick','nombre','nivel'];
	protected $dates = ['deleted_at'];
	protected $hidden = ['created_at','updated_at','deleted_at','pivot'];

	public static $rules = [
		'nick'=>'required|unique:rol|alpha|max:20|min:3',
		'nombre'=>'required|unique:rol|max:50|min:5',
		'nivel' => 'required|integer|min:1|max:10'
	];

	protected static $messages = [];

	public function users()
	{
		return $this->belongsToMany(User::class);
	}

	public function menu()
	{
		return $this->hasOne(Menu::class);
	}

	public static $getdata = ['menu'];
	public static $alldata = ['users'];
	public static $deletes = ['users'];
	public static $sort_order = ['nombre','asc'];
}