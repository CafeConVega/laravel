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
                margin: 10;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }
        </style>
    </head>
    <body>
      <div class="form">
       <h1>Enter NFL Team Details</h1>
       {{ Form::open(array('url' => 'nfl'))}}
           {{ Form::label('city', 'City')}}
           {{ Form::text('city')}}
           <br>
           <br>
           {{ Form::label('state', 'State')}}
           {{ Form::text('state')}}
           <br>
           <br>
           {{ Form::label('name', 'Name')}}
           {{ Form::text('name')}}
           <br>
           <br>
           {{ Form::label('stadium', 'Stadium')}}
           {{ Form::text('stadium')}}
           <br>
           <br>
           {{ Form::label('conference', 'Conference')}}
           {{ Form::text('conference')}}
           <br>
           <br>
           {{ Form::label('division', 'Division')}}
           {{ Form::text('division')}}
           <br>
           <br>
           {{ Form::label('color_primary', 'Primary Color')}}
           {{ Form::text('color_primary')}}
           <br>
           <br>
           {{ Form::label('color_secondary', 'Secondary Color')}}
           {{ Form::text('color_secondary')}}
           <br>
           <br>
           {{ Form::label('color_alternate', 'Alternate Color')}}
           {{ Form::text('color_alternate')}}
           <br>
           <br>
           {{ Form::submit('Submit')}}
       {{ Form::close()}}
       </div>
       
       <div class="teams">
              @foreach($teams as $teamss)
                  
                   <h3>{{ $teamss->city.", ".$teamss->state." ".$teamss->name." Play at ".$teamss->stadium." and play in the ".$teamss->conference." ".$teamss->division }}</h3>
                   
                   
               @endforeach
       </div>
    </body>
</html>
