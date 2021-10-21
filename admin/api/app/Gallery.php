<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use SoftDeletes;
    
    protected $table =  'gallery';

    protected $fillable = [
        'url_image',    
        'title',
        'description',
        'num_orden'
    ];

    public function photos () {

		return $this->hasMany(GalleryDetail::class);
    
    }

    protected $casts = [
        'num_orden' => 'integer'
    ];

    public static $rules = [];
    
    protected static $messages = [];
    
    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = [];
}
