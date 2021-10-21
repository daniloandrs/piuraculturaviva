<?php

namespace Beli\Auth\Traits;


trait HelperRequest
{
    public function getIp()
    {
    	return $this->request->ip();
    }
    public function getHost()
    {
    	return gethostbyaddr($this->request->ip());
    }

}
