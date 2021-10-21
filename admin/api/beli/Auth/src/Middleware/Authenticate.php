<?php

namespace Beli\Auth\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\Factory as Authenticador;
use Beli\Auth\Traits\HelperToken;
use Beli\Auth\Traits\HelperRequest;
use Carbon\Carbon;

class Authenticate 
{
    use HelperToken,HelperRequest;


    protected $auth;
    protected $request;
    protected $user;

    public function __construct(Authenticador $auth)
    {
        $this->auth = $auth;
        $this->request =   null;
        $this->user = null;
    }


    public function handle($request, Closure $next, ...$guards)
    {
        $this->request = $request;
        $this->authenticate($guards);
        return $next($request);
    }

    protected function authenticate(array $guards)
    {
        if (empty($guards)) {
            return $this->auth->authenticate();
        }
        foreach ($guards as $guard) {
            if($this->check($guard)){
                return $this->getAuth();
            }
        }
        throw new AuthenticationException('Unauthenticated.', $guards);
    }

}
