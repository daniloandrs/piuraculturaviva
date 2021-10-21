<?php  
namespace Beli\Roles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
	use SoftDeletes;

	protected $table = 'menu';
	protected $fillable = ['nombre','rol_id'];
	protected $dates = ['deleted_at'];
	protected $hidden = ['created_at','updated_at','deleted_at'];

	public static $rules = [
		'nombre' => 'required|unique:menu|min:5|max:50',
		'rol_id' => 'required|unique:menu'
	];
	protected static $messages = [];

	public function items()
	{
		return $this->belongsToMany(Item::class);
	}

	public function rol()
	{
		return $this->belongsTo(Rol::class);
	}

	public static $getdata = ['rol'];
	public static $alldata =['items'];
	public static $deletes = ['items'];
	public static $sort_order = ['nombre','asc'];

}