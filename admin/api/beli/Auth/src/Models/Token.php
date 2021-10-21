<?php  
namespace Beli\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Token extends Model
{
	use SoftDeletes;

	protected $table = 'token';
	protected $fillable = ['token','user_id','ip'];
	protected $dates = ['deleted_at'];
	protected $hidden = ['deleted_at'];

	public static $rules = [
		'token' => 'required|unique:token|min:5|max:50',
		'user_id' => 'required',
		'dispositivo' => 'nullable',
		'ip' => 'nullable',
	];
	protected static $messages = [];

	public function user()
	{
		return $this->belongsTo('App\User');
	}

	public static $getdata = [];
	public static $alldata =[];
	public static $deletes = [];

}