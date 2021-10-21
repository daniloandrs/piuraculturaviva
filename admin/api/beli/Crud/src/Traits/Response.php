<?php

namespace Beli\Crud\Traits;

use App\Helpers\PrintHelper;

trait Response
{	

	public static function validacion($array_mensajes){
		return response()->json([
            'success' => false,
            'errors' => $array_mensajes
        ]);	
	}

	public static function mensajeOperacion($modelo,$operacion,$success = null,$id = null){
		if ($success) {
			return response()->json([
				'success' => true,
				'message' => $modelo. ' '.$operacion.' Correctamente.',
				'id' => $id
			]);
		}
		return response()->json([
			'success' => false,
			'message' => 'Error al intentar '.$operacion. ' '.$modelo
		]);
	}

	public static function informacion($datos_o_mensaje,$success = null){
		if ($success) {
			return response()->json([
	            'success' => true,
	            'info' => $datos_o_mensaje
	        ]);
	    }
	    return response()->json([
			'success' => false,
			'info' => $datos_o_mensaje
		]);
	}


	public static function withPrint($message, $data, $name = 'Ticket de Venta')
    {
        $document = (new PrintHelper)->getDocument($data);

        return response()->json([
            "success" => true,
            "message" => $message,
            "document" => [
                "name" => $name,
                "content" => $document,
                "options" => [
                    "font_size" => "12px",
                    "type" => "text/html",
                    "width" => "240px",
                ],
            ],
        ]);
	}
	

	public static function mensajeValidar($modelo){
		return \Response::json([
                    'success'=>false,
                    'message'=>'No se puede eliminar el registro de '.$modelo.' ya que
                                esta siendo utilizado por otros registros.'
                    ]);
	}

	public static function personalizado($message,$success = false){
		return \Response::json([
                    'success'=>$success,
                    'message'=>$message
                    ]);
	}

	public static function response_exception($message,$code = 500){
		return \Response::json([
                    'success'=>false,
                    'message'=>$message
                    ],$code);
	}
	
}