<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Business extends Model {

	use SoftDeletes;
	
	protected $table = 'business';
	
	protected $fillable =  [
	
		'business_name',
		'direction',
		'web_site',
		'contact_title',
		'contact_description',
		'contact_background_image_mobile',
		'contact_background_image',
		'about_us',
		'vision',
		'mission'
	];

	protected $casts = [];

	public static $rules = [];
	
	protected static $messages = [];

	public function logos () {

		return $this->hasMany(BusinessLogos::class);
	
	}
	
	public function emails () {

		return $this->hasMany(BusinessEmail::class);
	
	}
	
	public function social_networks () {
	
		return $this->hasMany(BusinessSocialNetworks::class);
	
	} 

	public function phones () {

		return $this->hasMany(BusinessPhone::class);
	
	}

	public function allies () {

		return $this->hasMany(BusinessAllies::class);
	
	}

	public static $getdata = [];

	public static $alldata = [];

	public static $deletes = [];
	
	public static $sort_order = ['business_name','asc'];

}

