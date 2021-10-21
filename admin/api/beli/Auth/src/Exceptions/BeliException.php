<?php

namespace Beli\Auth\Exceptions;
/**
 * Created by PhpStorm.
 * User: Eca
 * Date: 23/07/2017
 * Time: 13:51
 */
use Exception;

class BeliException extends Exception
{
    protected $message;
    protected $code;

    public function __construct($message,$code)
    {
        $this->message = $message;
        $this->code = $code;
        parent::__construct($this->message,$this->code);
    }

}