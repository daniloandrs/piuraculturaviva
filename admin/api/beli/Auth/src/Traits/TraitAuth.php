<?php

namespace Beli\Auth\Traits;
use Auth;
use Beli\Roles\Models\Opcion;
use Beli\Roles\Models\Item;
use Beli\Auth\Exceptions\BeliException;
use Beli\Auth\Models\Token;
trait TraitAuth
{
	public function getDataMenu($usuario)
	{
		$min = $usuario->roles()->min('nivel');
		$rol = $usuario->roles()->where('nivel',$min)->first();
		$menu = $rol->menu;
		$ids_opciones = [];
		$all_items = [];
		foreach ($usuario->roles as $rol) {
			$items = $rol->menu->items;
			foreach ($items as $item) {
				$ids_opciones[] = $item->opcion_id;
				$all_items[] = $item->id;
			}
		}
		$items_assigned = Item::whereIn('id',$all_items)->get();
		$opciones = Opcion::whereIn('id',$ids_opciones)->get();
		foreach ($opciones as $opcion){
			$items = [];
			foreach ($items_assigned as $item) {
				if($item->opcion_id == $opcion->id){
					$items[] = $item;
				}
			}
			$opcion['items'] = $items;
		}
		$menu['opciones'] = $opciones;
		$menu->addHidden('items');
		$usuario->addHidden('roles','deleted_at');
		return $menu;
	}
	public function getDataItem($usuario){
		$items = [];
		$roles = $usuario->roles;
		foreach ($roles as $rol) {
			$menu = $rol->menu;
			foreach ($rol->menu->items as $item) {
				$item->addVisible('nombre','url');
				$items[] = $item;
			}
		}
		return $items;
	}

	public function getAcceso($usuario){
		$acceso = '../';
		return $acceso;
	}

	public function getToken($request)
	{
		$user = Auth::user();
		$date = date('Y-m-d-h-i-s');
		$new_token = bcrypt($user->id.$date);
		$token = Token::create([
				'token' => $new_token,
				'user_id' => $user->id,
				'ip' => $request->ip(),
				'dispositivo' => gethostbyaddr($request->ip())
			]);
		return $new_token;
	}


} 