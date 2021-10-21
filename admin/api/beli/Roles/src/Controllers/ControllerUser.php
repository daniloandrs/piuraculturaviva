<?php

namespace Beli\Roles\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\User;
use Beli\Roles\Models\Rol;
use Beli\Auth\Models\Token;
use Beli\Roles\Traits\TraitUser;

class ControllerUser extends Controller
{
  use TraitUser;

    /**
     * [getRoles : obtener roles de usuario seleccionado]
     * @param  User   $usuario [description]
     * @return [type]          [description]
     */
    public function getRoles(User $usuario){
        $level_for_auth = self::getMinimumLevelRol();
        $operator = ($level_for_auth == 0)?'>=':'>';
        $roles = Rol::where('nivel',$operator,$level_for_auth)->get();
        foreach ($roles as $rol) {
          $rol['check'] = 0;
          foreach($usuario->roles as $user_rol){
            if($rol->id == $user_rol->id){
              $rol['check'] = 1;
            }
          }
        }
        return self::informacion($roles,true);
    }

    public function giveRolUsuario(Request $request){

      $user_id = $request->get('user_id');
      $rol_id = $request->get('rol_id');
      $usuario = User::find($user_id);
      $flag_operacion = true;
      //si el usuario tiene el rol se lo quitamos
      if($usuario->roles()->where('rol.id',$rol_id)->first()){
        if(count($usuario->roles) == 1 ){
          return self::personalizado('Debe conservar por lo menos un rol por usuario',false);
        }else{
          $usuario->roles()->detach($rol_id);
          return self::mensajeOperacion('Rol','quitado',true);
        }
      }else{
        $usuario->roles()->attach($rol_id);
         return self::mensajeOperacion('Rol','asignado',true);
      }
    }
    
    public function suspendUsuario(User $usuario){
      // self::validatePermission("delete.user");

      if($usuario->roles()->where('rol_id',1)->first()){
        return self::personalizado('El usuario que desea suspender cuenta con rol de SuperAdministrador',false);
      }else{
        $usuario->delete();
        return self::mensajeOperacion('Usuario','suspendido',true);
      }
    }
    
    public function getDataAuth(){
      $usuario = Auth::user();
      return self::informacion($usuario,true);
    }

    /**
     * [getMinRoles : Obtener roles con nivel mayor al menor nivel del usuario autenticado]
     * @return [type] [description]
     */
    public function getMinRoles()
    {
        try{
             $level = self::getMinimumLevelRol();
             $operator = ($level == 0)?'>=':'>';
             $roles = self::crud('rol')->where('nivel',$operator,$level)->get();
             return self::informacion($roles,true);
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }
    /**
     * [getUserForNick : Obtener usuario por nick]
     * @param  [type] $nick [nick de usuario]
     * @return [type]       [description]
     */
    public function getUserForNick($nick)
    {
        try{
            $usuario  = User::where('nick',$nick)->first();
            if(isset($usuario)){
                $usuario->addVisible('id','nick','email','profile_image');
                return self::informacion($usuario,true);
            }
            return self::personalizado("No se encontro el usuario",false);
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }
    /**
     * [getUsersForMinRol : Obtener usuarios por nivel minimo de rol]
     * @return [type] [description]
     */
    public function getUsersForMinRol()
    {
        try{
             $level = self::getMinimumLevelRol();
             $users = self::crud('user')->whereHas('roles',function($query)use($level)
             {
                $operator = ($level == 0)?'>=':'>';
                $query->where('nivel',$operator,$level);
             })->get();
             return self::informacion($users,true);
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

    /**
     * [getUsersTrashedForMinRol : Listar usuarios suspendidos por nivel minimo de rol]
     * @return [type] [description]
     */
    public function getUsersTrashedForMinRol()
    {
        try{
             $level = self::getMinimumLevelRol();
             $users = self::crud('user','trashed')->whereHas('roles',function($query)use($level)
             {
                $operator = ($level == 0)?'>=':'>';
                $query->where('nivel',$operator,$level);
             })->get();
             return self::informacion($users,true);
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

}
