<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{$scope['title']}}</title>
        <meta property="og:image" content="{{$scope['og_image']}}">
        <meta property="og:type" content="article">
        <meta property="og:title" content="{{$scope['og_title']}}">
        <meta property="og:description" content="{{$scope['og_description']}}">
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />

    </head>

    <body>
           
        <script>

            let url = '{!! $scope['redirect'] !!}';

            let section = '{!! $scope['section'] !!}';

            let path = `${section}/${url}`;

            let redirectTo = `https://piuraculturaviva.com/#!/${path}`;

            document.location.href = redirectTo;

        </script>

    </body>

</html>