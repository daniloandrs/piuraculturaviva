<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Beli\Crud\Traits\Response;
use Beli\Crud\Traits\Crud;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests ,Response,Crud;
}
