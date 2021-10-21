<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'firebase' => [
        'api_key' => 'AIzaSyCYRBaXPCsYWA4jqabUbKu5PLCR9ewFKDE', 
        'auth_domain' => 'notionic-8c1b7.firebaseapp.com',
        'database_url' => 'https://notionic-8c1b7.firebaseio.com',
        'secret' => 'Xvk6Ks94zeZ5ZIu4873axfLbEL2lE6TkCkwscqc6',
        'storage_bucket' => 'notionic-8c1b7.appspot.com',
    ]

];
