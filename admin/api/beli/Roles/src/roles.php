<?php  

	date_default_timezone_set('America/Lima');
	
	Route::post('password/reset','ControllerUser@resetPassword');

	Route::group(['middleware' => 'beli:auth'],function(){
		Route::group(['prefix' => 'auth'],function (){
			Route::get('roles/getdata','ControllerUser@getMinRoles');
			Route::get('users/getdata','ControllerUser@getUsersForMinRol');
			Route::get('users/trashed','ControllerUser@getUsersTrashedForMinRol');
		});
		Route::group(['prefix' => 'user'],function (){
			Route::get('nick/show/{nick}','ControllerUser@getUserForNick');
		});

		Route::group(['prefix'=>'usuario'],function(){
			
			Route::get('roles/show/{usuario}','ControllerUser@getRoles');
			Route::post('rol/give','ControllerUser@giveRolUsuario');
			Route::delete('delete/{usuario}','ControllerUser@suspendUsuario');
			Route::get('auth/getdata','ControllerUser@getDataAuth');
		});
		Route::group(['prefix'=>'item'],function(){
			Route::post('menu/give','ControllerItem@giveItemMenu');
			Route::get('menu/show/{menu}','ControllerItem@getInfoMenu');
		});
		Route::group(['prefix'=>'cuenta'],function(){
			Route::put('nick/update/{user}','ControllerCuenta@nickUpdate');
			Route::put('email/update/{user}','ControllerCuenta@emailUpdate');
			Route::put('password/update/{user}','ControllerCuenta@passwordUpdate');
			Route::post('imagen_perfil/image','ControllerCuenta@changeImagePerfil');
			Route::post('create','ControllerCuenta@registerCuenta');
			Route::post('get_persona','ControllerCuenta@getPersona');
			Route::post('update','ControllerCuenta@updateCuenta');
		});
	});     