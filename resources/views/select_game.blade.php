@extends('layouts.app')

@section('content')
<div class="container">       
<div class="dropdown">
  <button id="home_team" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Home Team
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($teams as $teamss)
            <li data = "{{ $teamss->short}}" ><a>{{ $teamss->city." ".$teamss->name}}</a></li>
       @endforeach
  </ul>
</div>
<div class="dropdown">
  <button id="year" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Year
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($years as $yearss)
            <li data = "{{$yearss->season_year}}" ><a>{{ $yearss->season_year }}</a></li>
       @endforeach
  </ul>
</div>
<div class="dropdown">
  <button id="away_team" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Away Team
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
       @foreach($teams as $teamss)
            <li data = "{{ $teamss->short}}" ><a>{{ $teamss->city." ".$teamss->name}}</a></li>
       @endforeach
  </ul>
</div>
</div>
@endsection
