<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryDetail extends Model
{
    use SoftDeletes;
    
    protected $table =  'gallery_detail';

    protected $fillable = 
    [
        'url_image',
        'gallery_id',
        'description'
    ];

    protected $casts = [];

    public static $rules = [];
    
    protected static $messages = [];

    public function gallery () {

		  return $this->belongsTo(Gallery::class);
    
    }

    public static $getdata = [];

    public static $alldata = [];
    
    public static $deletes = [];

    public static $sort_order = [];
}
