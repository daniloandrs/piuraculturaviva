<?php  
namespace Beli\Roles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
	use SoftDeletes;

	protected $table = 'item';
	protected $fillable = ['nombre','url','opcion_id'];
	protected $dates = ['deleted_at'];
	protected $hidden = ['created_at','updated_at','deleted_at'];
	protected  static $messages = [];
	public static $rules = [
		'nombre' => 'required|min:4|max:80',
		'url' => 'required|min:4|max:60|unique:item',
		'opcion_id' => 'nullable'
	];

	public function opcion()
	{
		return $this->belongsTo(Opcion::class);
	}
	public function menus()
	{
		return $this->belongsToMany(Menu::class);
	}

	public static $getdata = ['opcion'];
	public static $alldata = ['menus'];
	public static $deletes = ['menus'];
	public static $sort_order = ['nombre','asc'];
}