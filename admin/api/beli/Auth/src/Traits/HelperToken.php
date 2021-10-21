<?php

namespace Beli\Auth\Traits;

use Carbon\Carbon;
use Beli\Auth\Models\Token;
use Beli\Auth\Exceptions\BeliException;
use Auth;

trait HelperToken
{
    public function check()
    {
        return ! is_null($this->user());
    }

    public function user()
    {
        if (! is_null($this->user)) {
            return $this->user;
        }

        $user = null;

        $token = $this->getTokenForRequest();

        if (! empty($token)) {
            $user = $this->proccessToken($token);
        }
        
        return $this->user = $user;
    }

    public function getTokenForRequest()
    {
       $token = $this->request->query('api_token');
        if (empty($token)) {
            $token = $this->request->bearerToken();
        }
        return $token;
    }


    public function proccessToken($token)
    {
    	if (empty($token)) {
            return;
        }
        $query = Token::where('token',$token)->first();
        if(empty($query)){
            return;
        }
        $query->touch();//Update column updated_at
        return $query->user;
    }

    public function getAuth()
    {
        return Auth::login($this->user);
    }
}
