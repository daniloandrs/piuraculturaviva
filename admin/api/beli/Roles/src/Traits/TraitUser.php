<?php

namespace Beli\Roles\Traits;
use Auth;

trait TraitUser
{
	/**
	 * [getMinimumLevelRol : Obtener el minimo nivel de rol]
	 * @return [type] [description]
	 */
	public function getMinimumLevelRol($user = null )
	{
		if($user == null){
			$user = Auth::user();
		}
		return $user->roles()->min('nivel');
	}

} 