<?php

return [

    'models' => [
        'user' => App\User::class,
        'rol' => Beli\Roles\Models\Rol::class,
        'menu' => Beli\Roles\Models\Menu::class,
        'opcion' => Beli\Roles\Models\Opcion::class,
        'item' => Beli\Roles\Models\Item::class,

        'slider' => App\Slider::class,
        'category_type' => App\CategoryType::class,
        'category' => App\Category::class,
        'sub_category' => App\SubCategory::class,
        'post'  => App\Post::class,
        'virtual_tours' => App\VirtualTours::class,

        'business_phone' => App\BusinessPhone::class,
        'business_email' => App\BusinessEmail::class,
        'business_social_networks' => App\BusinessSocialNetworks::class,
        'event_type' => App\EventType::class,
        'event' => App\Event::class,
        
        'blog'  => App\Blog::class,
        'comment' => App\Comment::class,
        'business' => App\Business::class,
    ],  

    'views' => [
        'user' => 'Usuario',
        'rol' => 'Rol',
        'menu' => 'Menu',
        'opcion' => 'Opcion',
        'item' => 'Item',

        'slider' => 'Slider',
        'editor' => 'Editor',
        'category_type' => 'Tipo de Categoría',
        'category' => 'Categoría',
        'sub_category' => 'Sub Categoría',
        'post'  => 'Noticias',
        'virtual_tours' => 'Recorridos Virtuales',
        'business_phone' => 'Empresa Teléfonos',
        'business_email' => 'Empresa Correos',
        'business_social_networks' => 'Empresa Redes',
        'event_type' => 'Tipo de Evento',
        'event' => 'Evento',
        'blog'  => 'Blog',
        'comment' => 'Comentarios',
        'business' => 'Empresa'
    ],

    'image' => [
        'default' => 'avatars/avatar.png',
    ],

];
