<?php

namespace Beli\Auth\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\User;
use Beli\Auth\Models\Token;

class ControllerToken extends Controller
{
  	public function deleteToken(Request $request)
    {
        Token::where('token',$request->get('token'))->first()->delete();
        return self::mensajeOperacion('Session','cerrada',true);
    }

    public function getTokens(User $usuario)
    {
        return self::informacion($usuario->tokens,true);
    }
    public function limpiarSesiones(User $usuario)
    {
   		$usuario->tokens()->delete();
   		return self::mensajeOperacion('Sessiones','cerradas',true);
    }
}
