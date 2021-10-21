<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Member;
use App\Category;
use App\Helpers\Utilities;

class ControllerMember extends Controller
{
    public function getMembers () {

        $members = Member::all('id','name','url','description','button_text','button_link','logo','thumbnail','updated_at');

        foreach ($members as $member) {
            //$member->category_member;
   
            foreach ($member->sub_category_member as $value) {
                $value->category;
            }
            
        }

        return self::informacion($members,true);

    }

    public function categoryList () {

        $category = Category::where('category_type_id','=',Category::CATEGORY_TYPE_MEMBER)->get();

        return self::informacion($category,true);

    }

    public function createMember (Request $request) {

        try {  
            
            DB::beginTransaction();

                $url = $request->get('url');

                $search = Member::where('url','=',$url)->first();

                if(isset($search))
                    return self::personalizado('Esta url se encuentra en uso , por favor ingrese una nueva.');

                $member = Member::create($request->all());
    
                $mySubCategories = $request->get('mySubCategories');

                $arrmMCategories = explode(',', $mySubCategories);
            
                $path   = 'members/'.$member->id;
                     
                if($request->hasFile('thumbnail')) {
                    
                    $thumbnail = $request->file('thumbnail');
                    
                    $src_thumbnail = (new Utilities)->saveFile($thumbnail,$path);
                    
                    $member->thumbnail = $src_thumbnail;

                }

                if($request->hasFile('logo')) {
                    
                    $logo = $request->file('logo');
                    
                    $src_logo = (new Utilities)->saveFile($logo,$path);
                    
                    $member->logo = $src_logo;

                }

                $member->update();

                $sync = [];

                foreach ($arrmMCategories as  $value) {
                    
                    $sync[] =  ['sub_category_id' => $value];
                }
   
                $member->sub_category_member()->sync($sync);

            DB::commit();
           	
            return self::personalizado('Registrado correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }



    public function updateMember (Request $request) {

        try {
            
            DB::beginTransaction();

                $url = $request->get('url');

                $member_id = $request->get('id');

                $search = Member::where('url','=',$url)->where('id','!=',$member_id)->first();

                if(isset($search))
                    return self::personalizado('Esta url se encuentra en uso , por favor ingrese una nueva.');

                $member = Member::find($member_id);

                $data = (new Utilities)->Parse($request->except(['logo','thumbnail']));

                $path   = 'members/'.$member->id;

                $mySubCategories = $request->get('mySubCategories');

                $arrmMCategories = explode(',', $mySubCategories);
                    
                if($request->hasFile('thumbnail')) {
                    
                    $thumbnail = $request->file('thumbnail');
                    
                    \Storage::delete($member->thumbnail);

                    $src_thumbnail = (new Utilities)->saveFile($thumbnail,$path);

                    $data['thumbnail'] = $src_thumbnail;
                }

                if($request->hasFile('logo')) {
                    
                    $logo = $request->file('logo');
                    
                    \Storage::delete($member->logo);

                    $src_logo = (new Utilities)->saveFile($logo,$path);

                    $data['logo'] = $src_logo;
                }

                $member->update($data);

                $sync = [];

                foreach ($arrmMCategories as  $value) {
                    
                    $sync[] =  ['sub_category_id' => $value];
                }
   
                $member->sub_category_member()->sync($sync);

            DB::commit();
           	
            return self::personalizado('Actualizdo correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }


    public function myProfile (Request $request) {
        
        try {
            
            DB::beginTransaction();

                $member_id = $request->get('member_id');

                $member = Member::find($member_id);

                $member->photos;

            DB::commit();
                
            return self::informacion($member,true);
            
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
        
    }

    public function saveAbout (Request $request) {
        
        try {
            
            DB::beginTransaction();

                $member_id = $request->get('member_id');

                $member = Member::find($member_id);

                $member->update($request->all());

            DB::commit();
                
            return self::personalizado('Sección ACERCA DE , actualizada correctamente',true);
            
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }


    public function saveInfo (Request $request) {

        try {
            
            DB::beginTransaction();

                $member_id = $request->get('member_id');

                $member = Member::find($member_id);

                $member->update($request->all());

            DB::commit();
                
            return self::personalizado('Sección DATOS , actualizada correctamente',true);
            
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }


    public function delete (Request $request) {

        try {

            DB::beginTransaction();

                $member_id = $request->get('member_id');
                
                $member    = Member::find($member_id);

                if(is_null($member))
                    return self::personalizado("Este perfil ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($member->thumbnail);
                
                \Storage::delete($member->logo);
                
                $member->delete();

            DB::commit();
            
           	return self::personalizado("Perfil eliminado correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }
}
