<?php  
	date_default_timezone_set('America/Lima');
	
	Route::post('auth','ControllerAuth@login');
	
	Route::group(['middleware' => 'beli:auth'],function(){
		Route::post('logout','ControllerAuth@logout');
		Route::group(['prefix' => 'usuario'],function(){
			Route::post('token/remove','ControllerToken@deleteToken');
			Route::delete('sesiones/delete/{usuario}','ControllerToken@limpiarSesiones');
			Route::get('tokens/show/{usuario}','ControllerToken@getTokens');
			Route::get('menu/getdata','ControllerAuth@getMenu');
		});
	});