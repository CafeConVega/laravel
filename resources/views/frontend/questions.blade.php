<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">

        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
                font-size: 120px
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 96px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
              @foreach($questions as $question)
              <div> {!! $question->question !!}, {!! $question->points !!}</div>
              @endforeach
              </div>
        {!! Form::open(array('url' => '/questions')) !!}
        {!! Form::text('question') !!}
        {!! Form::text('points') !!}
        {!! Form::submit('Create Question'); !!}
        {!! Form::close() !!}
        </div>
    </body>
</html>
