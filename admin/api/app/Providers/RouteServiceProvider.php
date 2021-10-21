<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
        $this->mapRolesRoutes();
        $this->mapCrudRoutes();
        $this->mapAuthRoutes();
        //
    }

    protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web.php'));
    }

    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }

    protected function mapRolesRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace('Beli\Roles\Controllers')
             ->group(base_path('beli/Roles/src/roles.php'));
    }

    protected function mapCrudRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace('Beli\Crud\Controllers')
             ->group(base_path('beli/Crud/src/crud.php'));
    }

    protected function mapAuthRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace('Beli\Auth\Controllers')
             ->group(base_path('beli/Auth/src/auth.php'));
    }

}
