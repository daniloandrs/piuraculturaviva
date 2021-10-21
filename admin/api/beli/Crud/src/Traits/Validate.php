<?php

namespace Beli\Crud\Traits;

trait Validate
{
	protected static $errors;
	public static function validate($data){
        $v = \Validator::make($data, static::$rules,static::$messages);
        if ($v->fails()){
            self::$errors = $v->errors()->getMessages();
            return false;
        }
        return true;
    }

    public static function errors(){
        $errores = self::$errors;
        return self::$errors;
    }

}