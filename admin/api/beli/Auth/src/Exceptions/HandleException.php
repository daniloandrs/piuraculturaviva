<?php

namespace Beli\Auth\Exceptions;
/**
 * Created by PhpStorm.
 * User: Eca
 * Date: 23/07/2017
 * Time: 13:54
 */


class HandleException
{
    protected $error;

    public function __construct()
    {
        $this->error = array();
    }
    public static function instance()
    {
        return new HandleException();
    }

    public function make(\Exception $exception)
    {
        $this->error['error'] = $exception->getMessage();
        $this->error['code'] = $exception->getCode();
        return $this->error;
    }
}