<?php

namespace Beli\Roles\Controllers;

use Validator;
use Hash;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\User;
use App\Persona;
use DB;

class ControllerCuenta extends Controller
{

    public function nickUpdate(Request $request,User $user)
    {
      try{
        if($user->id != Auth::user()->id){
          return self::response_exception("Estas intentando modificar una cuenta que no te corresponde",411);
        }
        if($user->nick != $request->get('nick')){
            $validator = Validator::make($request->all(), ['nick' => 'unique:users|min:3|max:30']);
            if ($validator->fails()) {
                return self::personalizado($validator->errors()->getMessages());
            }
            $user->nick = $request->get('nick');
            $user->save();
            return self::personalizado('Nick de usuario actualizado correctamente',true);
        }
      }catch(\Exception $e){
          return self::personalizado($e->getMessage());
      }
    }

    public function emailUpdate(Request $request,User $user)
    {
      try{
        if($user->id != Auth::user()->id){
          return self::response_exception("Estas intentando modificar una cuenta que no te corresponde",411);
        }
        if($user->email != $request->get('email')){
          
            $validator = Validator::make($request->all(), ['email' => 'unique:users|min:10|max:100|email']);
            if ($validator->fails()) {
                return self::personalizado($validator->errors()->getMessages());
            }
            $user->email = $request->get('email');
            $user->save();
            return self::personalizado('Email de usuario actualizado correctamente',true);
        }
      }catch(\Exception $e){
          return self::personalizado($e->getMessage());
      }
    }

    public function passwordUpdate(Request $request,User $user)
    {
      try{
        if($user->id != Auth::user()->id){
          return self::response_exception("Estas intentando modificar una cuenta que no te corresponde",411);
        }
        if(Hash::check($request->get('password'),$user->password)){
          $validate = Validator::make($request->all(),[
              'new_password' => 'required|max:30|min:8'
            ]);
          if($validate->fails()){
            return self::personalizado($validate->errors(),false);
          }else{
            $user->password = bcrypt($request->get('new_password'));
            $user->last_updated_password = Carbon::now()->format('Y-m-d H:i:s');
            $user->save();
            return self::personalizado("Contraseña Actualizada correctamente",true);
          }

        }else{
          return self::personalizado([
            'password'=>'La contraseña ingresada no coincide con su contraseña actual'
            ],false);
        }
      }catch(\Exception $e){
          return self::personalizado($e->getMessage());
      }
    }

   public function changeImagePerfil(Request $request){
      try{
           $this->validate($request,[
            'imagen_perfil' => ['image','dimensions:max_width=400,max_height=400']
          ]);
            $imagen = $request->file('imagen_perfil');
            $extension = $imagen->getClientOriginalExtension();
            $usuario = Auth::user();
            if($usuario->profile_image != "avatars/avatar.png"){
              \Storage::delete($usuario->profile_image);
            }
            $usuario->profile_image = $imagen->storeAs('avatars',$usuario->id.'_'.date('Ymd-his').'.'.$extension);
            $usuario->save();
          return self::personalizado('Imagen de Perfil modificada correctamente',true);
      }catch(\Exception $e){
        return self::personalizado('La Imagen tiene dimensiones invalidas');
      }
   }

   public function registerCuenta (Request $request) {
	
		try {

			DB::beginTransaction();

			$validateUser = Validator::make($request->only('nick','email','password'),User::$rules,User::$messages);
			
			if($validateUser->fails())
				return self::validacion($validateUser->errors());

			$validatePerson = Validator::make($request->only('nombres','apellidos','dni','email'),Persona::$rules,Persona::$messages);
	    
			if($validatePerson->fails())
				return self::validacion($validatePerson->errors());


				$password = bcrypt($request->get('password'));  

				$remember_token = str_random(60);
				
				$user = $request->only('nick','email') + ['password' => $password , 'remenber_token' => $remember_token ];
				
				$userModel = User::create($user);

				$person =  $request->only('nombres','apellidos','dni','email','direccion');

				$personModel = Persona::create($person + ['user_id' => $userModel->id ]);
				
				$userModel->roles()->attach($request->only('rol_id'));

			DB::commit(); 

			return self::personalizado('Usuario registrado correctamente',true);

		} catch (\Exception $e)  {

			DB::rollBack();

			return self::personalizado($e->getMessage());
				
		}

  }
  
  public function updateCuenta (Request $request) { 
  
    $persona    = $request->get('persona');
    
    $user       = $request->get('user');

    $persona_id = $persona['id'];
    
    $user_id    =  $user['id'];
    
    $personRules = Persona::$rules;

    $personRules['dni']   = $personRules['dni'] . ',dni,'.$persona_id;
		$personRules['email'] = $personRules['email'] . ',email,'.$persona_id;
		
		$validatePerson = Validator::make($persona,$personRules,Persona::$messages);
    
    if($validatePerson->fails())
			return self::validacion($validatePerson->errors());


    $userRules = User::$rules;
    $userRules['password']   = 'nullable';

    $userRules['nick']  = $userRules['nick'] . ',nick,'.$user_id;
    $userRules['email'] = $userRules['email'] . ',email,'.$user_id;
    
    $validateUser = Validator::make($user,$userRules,User::$messages);
    
    if($validateUser->fails())
      return self::validacion($validateUser->errors());
      

		$personModel = Persona::find($persona_id);

    $personModel->update($persona);
    
    $userModel = User::find($user_id);

    if (isset($user['password'])) {
      $user['password'] = bcrypt($user['password']);
    }

		$userModel->update($user);

		return self::personalizado('Usuario actualizado correctamente',true);

  }
	
  	public function getPersona (Request $request) {

		$email = $request->get('email');

		$persona = User::where('email',$email)->with('persona')->first();

		return self::informacion($persona,true);
		  
 	}

}
