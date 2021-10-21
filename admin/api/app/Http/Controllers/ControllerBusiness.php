<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Carbon\Carbon;
use App\Business;
use App\BusinessLogos;
use App\BusinessPhone;
use App\BusinessEmail;
use App\BusinessAllies;
use App\BusinessSocialNetworks;
use App\Helpers\Utilities;

class ControllerBusiness extends Controller {

    public function updateBusiness (Request $request,$business_id) {

        try {
            
            DB::beginTransaction();

                if (isset($business_id)) {

                    $business = Business::find($business_id);

                    $business->update($request->all());
                
                } else {
                
                    Business::create($request->all());
                
                }

            DB::commit();

            return self::personalizado('Realizado correctamente.',true);

        } catch( \Exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        
        }
        
    }

    public function updateLogo(Request $request) {

        try {
        
            DB::beginTransaction();

            $business_id = $request->get('business_id');

            $logo = BusinessLogos::where('business_id','=',$business_id)->first();
            
            if ($logo) {

                if($request->hasFile('logo')){
				
                    $random = Carbon::now()->timestamp;
                        
                    $file = $request->file('logo');
                    
                    \Storage::delete($logo->image);
                    
                    $image = $file->storeAs('logos/'.$business_id,$random.'.jpg');
            
                    $logo->update(['image'=> $image]);
                }

            } else {

                $random = Carbon::now()->timestamp;
					
				$file = $request->file('logo');
				
				$image = $file->storeAs('logos/'.$business_id,$random.'.jpg');
				
                
                BusinessLogos::create(['business_id' => $business_id,'image' => $image ]);
            }

			DB::commit();
           	
           	return self::personalizado('Logo actualizado correctamente',true);

		} catch (\Exception $e) {

			DB::rollBack();
            
            return self::personalizado($e->getMessage());
        
        }
      
    } 

    public function updateContactImage(Request $request) {

        try {
              
            DB::beginTransaction();

            $business_id = $request->get('id');

            $business = Business::find($business_id);
                
            if($request->hasFile('contact_background_image')) {
                                
                $file = $request->file('contact_background_image');
                
                if ($request->get('key') == 'desktop') {

                    \Storage::delete($business->contact_background_image);
   
                    $url_image = (new Utilities)->saveFile($file,'business/contact_background_image');

                    $business->contact_background_image = $url_image;

                    $business->update();

                }  
            }
            
            if ($request->hasFile('contact_background_image_mobile')) { 

                if ($request->get('key') == 'mobile') {

                    $file = $request->file('contact_background_image_mobile');

                    \Storage::delete($business->contact_background_image_mobile);

                    $url_image = (new Utilities)->saveFile($file,'business/contact_background_image_mobile');

                    $business->contact_background_image_mobile = $url_image;

                    $business->update();
                }

            }

			DB::commit();
           	
           	return self::personalizado('Imagen actualizado correctamente',true);

		} catch (\Exception $e) {

			DB::rollBack();
            
            return self::personalizado($e->getMessage());
        
        }
      
    }
    

    public function getBusiness () {

        $business = Business::find(1);
        
        $business->logos;
        
        $business->phones;
        
        $business->emails;
        
        $business->social_networks;
        
        return self::informacion($business,true);

    }


    public function manageBusiness ($key)
    {
        $data;

        switch($key) {
            
            case 'phone':

                $data = BusinessPhone::where('business_id','=',1)->get();
           
                break;

            case 'email':
            
                $data = BusinessEmail::where('business_id','=',1)->get();
                
                break;
            
            case 'social_networks':
                
                $data = BusinessSocialNetworks::where('business_id','=',1)->get();
            
                break;
        }

        return self::informacion($data,true);
    }

    public function getAllies () {
        
        $allies = BusinessAllies::all();

        return self::informacion($allies,true);
    }

    public function createAllies (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $data =  [
                'name' => $request->get('name'),
                'url'  => $request->get('url'),
                'business_id' => $request->get('business_id')
            ];

            $allies  = BusinessAllies::create($data);

            if ($request->hasFile('logo')) {

                $path      = 'aliados/'.$allies->id;

                $image     = $request->file('logo');

                $url_image = (new Utilities)->saveFile($image,$path);
                
                $allies->logo = $url_image;
            
            } 
            
            $allies->update();

            DB::commit(); 
                
            return self::personalizado('Aliado añadido correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }

    }

    public function updateAllies (Request $request) {

        try {

            DB::beginTransaction();

            $allies_id = $request->get('id');
            
            $allies    = BusinessAllies::find($allies_id);

            $allies->name = $request->get('name');

            $allies->url = $request->get('url');
        
            if($request->hasFile('logo')) {
                
                $path   = 'aliados/'.$allies->id;

				$image = $request->file('logo');
				
				\Storage::delete($allies->logo);
				
                $url_image = (new Utilities)->saveFile($image,$path);
                
                $allies->logo = $url_image;
            }
            
            $allies->update();

            DB::commit();
           	
            return self::personalizado('Aliado actualizado correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }


    public function deleteAllies (Request $request) {
        
        try {

            DB::beginTransaction();

                $allies_id = $request->get('allies_id');
                
                $allies    = BusinessAllies::find($allies_id);

                if(is_null($allies))
                    return self::personalizado("Este aliado ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($allies->logo);
                
                $allies->delete();

            DB::commit();
            
           	return self::personalizado("Aliado eliminado correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }

}   
