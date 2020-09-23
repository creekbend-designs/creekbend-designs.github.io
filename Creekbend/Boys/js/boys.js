/*jslint browser:true */
'use strict';

var weatherConditions = new XMLHttpRequest();
var weatherForecast = new XMLHttpRequest();
var cObj;
var fObj;

// GET THE CONDITIONS



weatherConditions.open('GET', 'https://webapis.schoolcafe.com/api/GetMealType?schoolid=88fe5a5c-021b-48ea-bc56-735f089d1c3d&startdate=09/23/2020&enddate=09/23/2020', true);
weatherConditions.responseType = 'text';
weatherConditions.send(null);

weatherConditions.onload = function() {
    if (weatherConditions.status === 200){
        cObj = JSON.parse(weatherConditions.responseText); 
        console.log(cObj);

        return false;
        var whichFile = document.getElementById('title').innerHTML;
        if ((whichFile !== "Creekbend Weather") && (whichFile !== "Creekbend Designs"))
            return false;

        document.getElementById('weather').innerHTML = cObj.weather[0].description;
        document.getElementById('temperature').innerHTML = cObj.main.temp + "&deg;";

        if (whichFile === "Creekbend Designs") {
            var icon_path = "http://openweathermap.org/img/w/" + cObj.weather[0].icon + ".png";
            document.getElementById('icon').src = icon_path;
        }
        if (whichFile === "Creekbend Weather") {
            document.getElementById('location').innerHTML = cObj.name;
            document.getElementById('desc').innerHTML = "Wind Speed "+cObj.wind.speed;
        }


    } //end if
}; //end function


// GET THE FORECARST
weatherForecast.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?zip=80033,us&units=imperial&appid=39f52db394a9548fab312dd08c5734ed', true);
weatherForecast.responseType = 'text'; 
weatherForecast.send();

weatherForecast.onload = function() {
if (weatherForecast.status === 200){
	fObj = JSON.parse(weatherForecast.responseText);
    console.log(fObj);
    
    var whichFile = document.getElementById('title').innerHTML;
        if (whichFile !== "Creekbend Weather")
            return false;

    var date_raw = fObj.list[0].dt_txt;
    /* date_raw = date_raw.substring(5); */
    date_raw = date_raw.substring(5,11);
    document.getElementById('r1c1').innerHTML = date_raw;
    var icon_path = "http://openweathermap.org/img/w/" + fObj.list[0].weather[0].icon + ".png";
    document.getElementById('r1c2').src = icon_path;
    document.getElementById('r1c3').innerHTML = fObj.list[0].main.temp_min + "&deg;";
    document.getElementById('r1c4').innerHTML = fObj.list[0].main.temp_max + "&deg;";
    
    var date_raw = fObj.list[8].dt_txt;
    date_raw = date_raw.substring(5,11);
    document.getElementById('r2c1').innerHTML = date_raw;
    var icon_path = "http://openweathermap.org/img/w/" + fObj.list[8].weather[0].icon + ".png";
    document.getElementById('r2c2').src = icon_path;
    document.getElementById('r2c3').innerHTML = fObj.list[8].main.temp_min + "&deg;";
    document.getElementById('r2c4').innerHTML = fObj.list[8].main.temp_max + "&deg;";

    var date_raw = fObj.list[16].dt_txt;
    date_raw = date_raw.substring(5,11);
    document.getElementById('r3c1').innerHTML = date_raw;
    var icon_path = "http://openweathermap.org/img/w/" + fObj.list[16].weather[0].icon + ".png";
    document.getElementById('r3c2').src = icon_path;
    document.getElementById('r3c3').innerHTML = fObj.list[16].main.temp_min + "&deg;";
    document.getElementById('r3c4').innerHTML = fObj.list[16].main.temp_max + "&deg;";

    var date_raw = fObj.list[24].dt_txt;
    date_raw = date_raw.substring(5,11);
    document.getElementById('r4c1').innerHTML = date_raw;
    var icon_path = "http://openweathermap.org/img/w/" + fObj.list[24].weather[0].icon + ".png";
    document.getElementById('r4c2').src = icon_path;
    document.getElementById('r4c3').innerHTML = fObj.list[24].main.temp_min + "&deg;";
    document.getElementById('r4c4').innerHTML = fObj.list[24].main.temp_max + "&deg;";

    var date_raw = fObj.list[32].dt_txt;
    date_raw = date_raw.substring(5,11);
    document.getElementById('r5c1').innerHTML = date_raw;
    var icon_path = "http://openweathermap.org/img/w/" + fObj.list[32].weather[0].icon + ".png";
    document.getElementById('r5c2').src = icon_path;
    document.getElementById('r5c3').innerHTML = fObj.list[32].main.temp_min + "&deg;";
    document.getElementById('r5c4').innerHTML = fObj.list[32].main.temp_max + "&deg;";

} //end if
}; //end function


