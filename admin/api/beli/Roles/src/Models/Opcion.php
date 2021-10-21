<?php  
namespace Beli\Roles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Opcion extends Model
{
	use SoftDeletes;

	protected $table = 'opcion';
	protected $fillable = ['nombre','icono'];
	protected $dates = ['deleted_at'];
	protected $hidden = ['created_at','updated_at','deleted_at'];
	protected  static $messages = [];
	public static $rules = [
		'nombre' => 'required|unique:opcion|min:4|max:20',
		'icono' => 'required|min:3|max:15'
	];

	public function items()
	{
		return $this->hasMany(Item::class);
	}

	public static $getdata = [];
	public static $alldata = ['items'];
	public static $deletes = ['items'];
	public static $sort_order = ['nombre','asc'];
}