/*jslint browser:true */
'use strict';

var weatherConditions = new XMLHttpRequest();
var weatherForecast = new XMLHttpRequest();
var cObj;
var fObj;

// GET THE CONDITIONS



weatherConditions.open('GET', '//webapis.schoolcafe.com/api/GetMealType?schoolid=88fe5a5c-021b-48ea-bc56-735f089d1c3d&startdate=09/23/2020&enddate=09/23/2020', true);
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

