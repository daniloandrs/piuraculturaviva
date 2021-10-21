<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


/***
 * ---------------------- Page Web -------------------------
 * ----------------------------------------------------------
 */  


Route::get('shared/{section}/{url}','ControllerPage@getViewMetatags');


Route::group(['middleware' => 'metatag','prefix' => 'page' ], function () {
	
	Route::get('get_slider','ControllerPage@getSlider');

	Route::get('get_categories','ControllerPage@getCategories'); 
	
	Route::get('get_galleries','ControllerPage@getGalleries'); 
	
	Route::post('getPost','ControllerPage@getLibro');

	Route::post('get_members','ControllerPage@getMembers');

	Route::post('get_member_profile','ControllerPage@getMemberProfile');

	Route::post('get_categories_and_other_members','ControllerPage@getCategoriesAndMembers');
	 
	Route::post('get_photos','ControllerPage@getPhotos');
	
	Route::get('get_post','ControllerPage@getPost');

	Route::post('get_notice','ControllerPage@getNotice');

	Route::post('get_other_notices','ControllerPage@getOtherNotices');

	Route::get('get_virtual_tours','ControllerPage@getVirtualTours');

	Route::get('get_business','ControllerPage@getBusiness');

	Route::post('get_events','ControllerPage@getEvents');
	  
	Route::post('get_event_detail','ControllerPage@getEventDetail');

	Route::get('get_is_live','ControllerPage@getIsLive');  

	Route::get('sub_categories/{category_id}','ControllerPage@getSubcategories');  
	
	Route::post('get_other_blogs','ControllerPage@getOtherBlogs');

	Route::post('send_comment','ControllerPage@sendComment');

	Route::get('get_comments/{model}/{ip}/{item_id}','ControllerPage@getComments');

	Route::get('get_events_schedule','ControllerPage@getEventsSchedule'); 
	
	Route::get('get_events_by_day/{day}','ControllerPage@getEventsByDay');
	
	Route::get('get_event_by_id/{id}','ControllerPage@getEventById');

	/**forms */   

	Route::post('form_contact_send','ControllerPage@formContactSend');
	
});
 
Route::group(['prefix' => 'download'], function () {  
	
	Route::post('book','ControllerPage@downloadBook');
});


/** ------------------------ ADMIN ---------------------------------*/
/*------------------------------------------------------------------ */

Route::Group(['middleware' => 'beli:auth','prefix' => 'slider'], function () {
	Route::post('image','ControllerSlider@store');
	Route::post('update/image','ControllerSlider@update');
	Route::post('update_orden','ControllerSlider@updateOrden');
	Route::delete('delete/{id}','ControllerSlider@delete');
});


Route::Group(['middleware' => 'beli:auth','prefix' => 'category'], function () {
	
	Route::post('sub_category','ControllerCategory@getSubCategory');


});  

Route::Group(['middleware' => 'beli:auth','prefix' => 'business'], function () {
	
	Route::get('/','ControllerBusiness@getBusiness');
	Route::put('/update/{business_id}','ControllerBusiness@updateBusiness');
	Route::get('/manage/show/{key}','ControllerBusiness@manageBusiness');
	Route::post('/logo/image','ControllerBusiness@updateLogo');
	Route::post('/contact_image/image','ControllerBusiness@updateContactImage');
	
});  

Route::Group(['middleware' => 'beli:auth','prefix' => 'business_allies'], function () {
	
	Route::get('get_list','ControllerBusiness@getAllies');

	Route::post('create/image','ControllerBusiness@createAllies');
 
	Route::post('update/image','ControllerBusiness@updateAllies');
	
	Route::post('delete','ControllerBusiness@deleteAllies');

});
     
Route::group(['middleware' => 'beli:auth','prefix' => 'libro'], function () {
	
	Route::post('get_libro','ControllerLibro@getLibro');

	Route::post('background_create/image','ControllerLibro@createBackground');

	Route::post('background_mobile_create/image','ControllerLibro@createBackgroundMobile');

	Route::post('save_text','ControllerLibro@saveText');
	
});    

/** Para Libro  */

Route::group(['middleware' => 'beli:auth','prefix' => 'gallery'], function () {
	
	Route::post('add','ControllerLibroGaleria@createGallery');

	Route::post('update/image','ControllerLibroGaleria@updateGallery');

	Route::post('delete','ControllerLibroGaleria@deleteGallery');


});

/**end libro */
 

Route::group(['middleware' => 'beli:auth','prefix' => 'member'], function () {
	
	Route::get('get_members','ControllerMember@getMembers');

	Route::get('categoryList','ControllerMember@categoryList');
	
	Route::post('my_profile','ControllerMember@myProfile');
	
	Route::post('save_about','ControllerMember@saveAbout');
	
	Route::post('create/image','ControllerMember@createMember');
	
	Route::post('update/image','ControllerMember@updateMember');
	
	Route::post('save_info','ControllerMember@saveInfo');
	
	Route::post('delete','ControllerMember@delete');
	
});
  
  
Route::group(['middleware' => 'beli:auth','prefix' => 'photo'], function () {
	
	Route::post('create_gallery','ControllerPhoto@createGallery');

	Route::post('update_image/image','ControllerPhoto@updateGallery');

	Route::post('delete_image','ControllerPhoto@deleteGallery');
   
}); 


Route::group(['middleware' => 'beli:auth','prefix' => 'gallery_view'], function () {
	
	Route::get('get_list','ControllerGallery@ListGallery');
	
	Route::post('create/image','ControllerGallery@createGallery');
 
	Route::post('update/image','ControllerGallery@updateGallery');

	Route::post('delete','ControllerGallery@deleteGallery');

	Route::post('update_order','ControllerGallery@updateOrder');

	/** detail */
	
}); 


Route::group(['middleware' => 'beli:auth','prefix' => 'gallery_detail'], function () {

	Route::post('get_list','ControllerGalleryDetail@GetList');
	
	Route::post('create_gallery','ControllerGalleryDetail@createGallery');

	Route::post('update/image','ControllerGalleryDetail@updateGallery');

	Route::post('delete','ControllerGalleryDetail@deleteGallery');
	
});


Route::group(['middleware' => 'beli:auth','prefix' => 'post'], function () {
	
	Route::get('category_list','ControllerPost@categoryList');

	Route::post('create_newspaper/image','ControllerPost@createNewspaper');

	Route::post('update_newspaper/image','ControllerPost@updateNewspaper');

	Route::post('delete_newspaper','ControllerPost@deleteNewspaper');
}); 
 

Route::group(['middleware' => 'beli:auth','prefix' => 'virtual_tours'], function () {

	Route::post('create/image','ControllerVirtualTours@create');

	Route::post('update/image','ControllerVirtualTours@update');

	Route::post('delete','ControllerVirtualTours@delete');

}); 



Route::group(['middleware' => 'beli:auth','prefix' => 'event'], function () {

	Route::post('create/image','ControllerEvent@create');

	Route::post('update/image','ControllerEvent@update');

	Route::post('delete','ControllerEvent@delete');

}); 


Route::group(['middleware' => 'beli:auth','prefix' => 'blog'], function () {

	Route::post('create_blog/image','ControllerBlog@createBlog');

	Route::post('update_blog/image','ControllerBlog@updateBlog');

	Route::post('delete_blog','ControllerBlog@deleteBlog');
}); 


Route::group(['middleware' => 'beli:auth','prefix' => 'comment'], function () {
	
	Route::get('get_comments/{model}/{item_id}','ControllerComment@getComments');

	Route::post('approved','ControllerComment@approved');

	Route::post('not_approved','ControllerComment@notApproved');
	
	Route::delete('delete/{id}','ControllerComment@delete');
	
});     