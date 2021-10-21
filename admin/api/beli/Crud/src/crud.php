<?php  

date_default_timezone_set('America/Lima');
	
Route::group(['middleware' => 'beli:auth'],function(){
	Route::post('getdata','ControllerMantenimiento@index');
    Route::post('create','ControllerMantenimiento@store');
    Route::post('show','ControllerMantenimiento@show');
    Route::post('update','ControllerMantenimiento@update');
    Route::post('delete','ControllerMantenimiento@destroy');
    Route::post('restore','ControllerMantenimiento@restore');
    Route::post('trashed','ControllerMantenimiento@trashed');
});

    