<?php
namespace Beli\Auth\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use Beli\Auth\Traits\TraitAuth;
use Beli\Auth\Traits\HelperRequest;

class ControllerAuth extends Controller
{
    use TraitAuth,HelperRequest;

    public function login(Request $request)
    {
      try{
        if (Auth::attempt($request->all())) {
           $usuario = Auth::user();
           $menu = $this->getDataMenu($usuario);
           $items = $this->getDataItem($usuario);
           $acceso = $this->getAcceso($usuario);
           $token = $this->getToken($request);
           return \Response::json([
                'success'=>true,
                'token' => $token,
                'menu' => $menu,
                'rutas' => $items,
                'user' => $usuario,
                'access' =>  $acceso
                ]);
        }
        else
        {
          return self::personalizado('Credenciales Incorrectas');
        }
      }catch(\Exception $e){
        return self::personalizado($e->getMessage());
      }
    }

    public function logout(Request $request)
    {
      $token = $request->get('token');
      Auth::user()->tokens()->where('token',$token)->delete();
      Auth::logout();
    }

    public function getMenu(){
      $usuario = Auth::user();
      $menu = $this->getDataMenu($usuario);
      $items = $this->getDataItem($usuario);
      return \Response::json([
            'success' => true,
            'menu' => $menu,
            'rutas' => $items
        ]);
    }
}
