/*jslint browser:true */
'use strict';

var weekInfo;
var dayArray = new Array(7);
var eventInfo;

function setup() {
    var today = new Date();
    var day = today.getDay();
    today = today.toDateString();
    dayArray[0] = today.substring(4,10);
    
    // Determine the next 6 days
    for (var i = 1; i < 7; i++) {
        var nextday = new Date(today);
        nextday.setDate(nextday.getDate()+i);
        nextday = nextday.toDateString();
        dayArray[i] = nextday.substring(4,10);
    }
    
    // Read in the weekly json file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "data/weekly.json", true);
    xhr.responseType = 'text';
    xhr.send();

    xhr.onload = function() {
        if(xhr.status === 200) {
            weekInfo = JSON.parse(xhr.responseText);
            //console.log(weekInfo);

            var curday = 0;
            for (i = day; i < weekInfo.length; i++) {
                //console.log(weekInfo[i]);
                document.getElementById("day"+curday).innerHTML = weekInfo[i].dow;
                document.getElementById("day"+curday).value = i;
                curday++;
            }
            for (i = 0; i < day; i++) {
                //console.log(weekInfo[i]);
                document.getElementById("day"+curday).innerHTML = weekInfo[i].dow;
                document.getElementById("day"+curday).value = i;
                curday++;
            }
            
            loadDayInfo(day, 0);    
        }
    }
    
    // Read in the event json file
    var xhrE = new XMLHttpRequest();
    xhrE.open('GET', "data/events.json", true);
    xhrE.responseType = 'text';
    xhrE.send();

    xhrE.onload = function() {
        if(xhrE.status === 200) {
            eventInfo = JSON.parse(xhrE.responseText);
            //console.log(eventInfo);
            
            loadEvents(day, 0);            
        }
    }
        
} // setup

function loadDayInfo(day, key) {
    //console.log("In loadDayInfo: " + day + " " + key);
    
    var outstring = "";
    /*
    if (key === "0")
        outstring = "Today ";
    else if (key === "1")
        outstring = "Tomorrow ";
    */
    document.getElementById("thisday").innerHTML = outstring + weekInfo[day].dow + " " + dayArray[key];

} // loadDayInfo

function loadEvents(day, key) {
    //console.log("In loadEvents: " + day + " " + key);

    var compdow = weekInfo[day].dow.substring(0,3);
    var compmon = dayArray[key].substring(0,3);
    var compdate = dayArray[key].substring(4,6);
    if (compmon === "Jan")
        compmon = "01";
    else if (compmon === "Feb")
        compmon = "02";
    else if (compmon === "Mar")
        compmon = "03";
    else if (compmon === "Apr")
        compmon = "04";
    else if (compmon === "May")
        compmon = "05";
    else if (compmon === "Jun")
        compmon = "06";
    else if (compmon === "Jul")
        compmon = "07";
    else if (compmon === "Aug")
        compmon = "08";    
    else if (compmon === "Sep")
        compmon = "09";
    else if (compmon === "Oct")
        compmon = "10";
    else if (compmon === "Nov")
        compmon = "11";
    else if (compmon === "Dec")
        compmon = "12";
    var compareit = compmon + "-" + compdate;
    var length = eventInfo[0].event.length;
    var events = "";
    for (var i = 0; i < length; i++) {
        var curEvent = eventInfo[0].event[i];
        var forWhom = "";
        if (typeof(curEvent.for) === "object") {
            var forLen = curEvent.for.length;
            for (var k = 0; k < forLen; k++) {
                if (k === (forLen - 1)) {
                    forWhom += " and ";
                    forWhom += curEvent.for[k] + "'s";
                }
                else
                    forWhom += curEvent.for[k];
                if (k < (forLen - 2))
                    forWhom += ", ";                
            }
        }
        else
            forWhom = curEvent.for + "'s";
        if (typeof(curEvent.day) === "object") {
            for (var j = 0; j < curEvent.day.length; j++) {
                if (curEvent.day[j] === compdow) {
            events +=  addToEvents(forWhom, curEvent.description, curEvent.time, curEvent.location);
                }   
            }            
        }
        if ((curEvent.day !== "undefined") &&
            (curEvent.day === compdow)) {
            // events += eventInfo[0].event[i].description + " " + eventInfo[0].event[i].time + " @ " + eventInfo[0].event[i].location + "<br>";
           events +=  addToEvents(forWhom, curEvent.description, curEvent.time, curEvent.location);
        }
        else if ((curEvent.date !== "undefined") && 
            (curEvent.date === compareit)) {
            //console.log(eventInfo[0].event[i]);
            events +=  addToEvents(forWhom, curEvent.description, curEvent.time, curEvent.location);
        }
    }
    if (events === "")
        events = "No scheduled events";
    //console.log(events);
    document.getElementById("myevents").innerHTML = events;

} // loadEvents

function addToEvents(forWhom,description,time,location) {

    var newevent = "<p>"+forWhom + " " + description + " " + time + " @ " + location + "</p>";
    return newevent;
} // addToEvents

function switchDay(clicked_id) {
    //console.log("In switchDay: " + clicked_id);
    
    // Check to see if the first day in the list is today. If not run setup again
    var today = new Date();
    var day = today.getDay();
    if (day != document.getElementById("day0").value)
        setup();
    
    var key = clicked_id.substring(3);
    var day = document.getElementById(clicked_id).value;
    
    // Make the clicked day be the active item
    for (var i = 0; i < 7; i++) {
        var element = document.getElementById("day"+i);
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        }
        if (i === Number(key))
            element.classList.add("active");
    }

    loadDayInfo(day, key);
    loadEvents(day, key);
    loadWeather(day, key);

} // switchDay

function switchKid(clicked_id) {
    //console.log("In switchKid: " + clicked_id);
    
    var boyArray = ["boys","owen","andrew","austin"];

    if ((clicked_id === 'boys') || (clicked_id === 'owen'))
        document.getElementById("OD_card").style.display = "block"; 
    else
        document.getElementById("OD_card").style.display = "none"; 

    if ((clicked_id === 'boys') || (clicked_id === 'andrew'))
        document.getElementById("AW_card").style.display = "block"; 
    else
        document.getElementById("AW_card").style.display = "none"; 

    if ((clicked_id === 'boys') || (clicked_id === 'austin'))
        document.getElementById("AC_card").style.display = "block"; 
    else
        document.getElementById("AC_card").style.display = "none"; 
    
    // Make the clicked boy be the active item
    for (var i = 0; i < 4; i++) {
        var element = document.getElementById(boyArray[i]);
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        }
        if (clicked_id === boyArray[i])
            element.classList.add("active");
    }

    
} // switchKid

var weatherConditions = new XMLHttpRequest();
var cObj;

// GET THE CONDITIONS
weatherConditions.open('GET', '//api.openweathermap.org/data/2.5/onecall?lat=39.77&lon=-105.1&exclude=minutely,alerts&units=imperial&appid=39f52db394a9548fab312dd08c5734ed', true);

weatherConditions.responseType = 'text';
weatherConditions.send(null);

weatherConditions.onload = function() {
    if (weatherConditions.status === 200){
        cObj = JSON.parse(weatherConditions.responseText); 
        //console.log(cObj);
        
        loadWeather("day", 0);

    } //end if
}; //end function

function loadWeather(day, key) {
    // console.log("In loadWeather: " + day + " " + key);

    var icon_path;
    var srise;
    var srdate;
    var sset;
    var ssdate;
    
    if (Number(key) === 0) {
      
        // Determine the current hour
        var curhour = new Date();
        //console.log(curhour);
        //console.log(curhour.getHours());
        var found = false;
        for (var i = 0; i < 24 && !found; i++) {
            let thedate = cObj.hourly[i].dt;
            let td = new Date(thedate*1000);
            //console.log(td);
            if (td.getHours() === curhour.getHours()) {
                found = true; 
                document.getElementById('weather').innerHTML = cObj.hourly[i].weather[0].description;
                document.getElementById('temperature').innerHTML = cObj.hourly[i].temp + "&deg;";
                icon_path = "http://openweathermap.org/img/w/" + cObj.hourly[i].weather[0].icon + ".png";
                document.getElementById('icon').src = icon_path;
            }
        }
    
        document.getElementById('location').innerHTML = "Wheat Ridge";
        document.getElementById('lowtemp').innerHTML = "Low " + cObj.daily[key].temp.min + "&deg;";
        document.getElementById('hightemp').innerHTML = "High " + cObj.daily[key].temp.max + "&deg;";
        srise = cObj.current.sunrise;
        srdate = new Date(srise*1000);
        document.getElementById('sunrise').innerHTML = "Sunrise " + srdate.getHours() + ":" + srdate.getMinutes();
        sset = cObj.current.sunset;
        ssdate = new Date(sset*1000);
        document.getElementById('sunset').innerHTML = "Sunset " + ssdate.getHours() + ":" + ssdate.getMinutes();
    }
    else {
        //let thedate = cObj.daily[key].dt;
        //let td = new Date(thedate*1000);
        //console.log(td);
        document.getElementById('weather').innerHTML = cObj.daily[key].weather[0].description;
        document.getElementById('temperature').innerHTML = "";
        icon_path = "http://openweathermap.org/img/w/" + cObj.daily[key].weather[0].icon + ".png";
        document.getElementById('icon').src = icon_path;
    
        document.getElementById('location').innerHTML = "Wheat Ridge";
        document.getElementById('lowtemp').innerHTML = "Low " + cObj.daily[key].temp.min + "&deg;";
        document.getElementById('hightemp').innerHTML = "High " + cObj.daily[key].temp.max + "&deg;";
        srise = cObj.daily[day].sunrise;
        srdate = new Date(srise*1000);
        document.getElementById('sunrise').innerHTML = "Sunrise " + srdate.getHours() + ":" + srdate.getMinutes();
        sset = cObj.daily[key].sunset;
        ssdate = new Date(sset*1000);
        document.getElementById('sunset').innerHTML = "Sunset " + ssdate.getHours() + ":" + ssdate.getMinutes();
    }
} // loadWeather
 
var peakMenu = new XMLHttpRequest();
var everittMenu = new XMLHttpRequest();
var pObj;
var mObj;

// GET THE Peak SCHOOL MENU
//peakMenu.open('GET', 'https://webapis.schoolcafe.com/api/GetMealType?schoolid=88fe5a5c-021b-48ea-bc56-735f089d1c3d&startdate=09/23/2020&enddate=09/23/2020', true);
/*
peakMenu.open('GET', 'https://webapis.schoolcafe.com/api/CalendarView/GetDailyMenuitems?SchoolId=88fe5a5c-021b-48ea-bc56-735f089d1c3d&ServingDate=09%2F23%2F2020&ServingLine=Main&MealType=Lunch', true);
*/
peakMenu.open('GET', '//webapis.schoolcafe.com/api/CalendarView/GetDailyMenuitems?SchoolId=88fe5a5c-021b-48ea-bc56-735f089d1c3d&ServingDate=10%2F02%2F2020&ServingLine=Main&MealType=Lunch', true);

/*peakMenu.withCredentials = true;*/
peakMenu.responseType = 'text';
peakMenu.send(null);

peakMenu.onload = function() {
    if (peakMenu.status === 200){
        pObj = JSON.parse(peakMenu.responseText); 
        console.log(pObj);
    } //end if
}; //end function

function loadChores() {
    // JavaScript Document
    var choreInfo;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "data/chores.json", true);
    xhr.responseType = 'text';
    xhr.send();

    xhr.onload = function() {
        if(xhr.status === 200) {
            choreInfo = JSON.parse(xhr.responseText);
            //console.log(choreInfo);
                        
            parseChores(choreInfo);
        }
    }
} // loadChores

function parseChores(objI) {

    var curcat = "";
    var ODchecklist = "";
    var AWchecklist = "";
    var ACchecklist = "";
    var mystring;
    for (var i = 0; i < objI.length; i++) {
        //console.log(objI[i]);
        //var keys = Object.keys(objI[i]);
        //console.log("num keys " + keys.length);
        if (objI[i].category !== curcat) { // Start new list
            curcat = objI[i].category;
             mystring = "<label class=\"chore_time\">" + curcat + " chores to be completed by " + objI[i].fbt + "</label><br>";
            ODchecklist += mystring;
            AWchecklist += mystring;
            ACchecklist += mystring;
        }
        else {
        //var label = "OD" + curcat + i;
            var whofor = objI[i].for;
            if ((typeof whofor === "undefined") || (whofor === "OD")) {
                var label = "ODchore" + i;
                ODchecklist += "<span><input class=\"chore_label\" type=\"checkbox\" onclick=\"totalpts(this.id)\" id=\"" + label + "\" value=\"" + objI[i].points + "\"><label class=\"chore_label\" for=\"" + label + "\">" + objI[i].desc + "<\label></span><br>";
            }
            if ((typeof whofor === "undefined") || (whofor === "AW")) {
                var label = "AWchore" + i;
                AWchecklist += "<span><input class=\"chore_label\" type=\"checkbox\" onclick=\"totalpts(this.id)\" id=\"" + label + "\" value=\"" + objI[i].points + "\"><label class=\"chore_label\" for=\"" + label + "\">" + objI[i].desc + "<\label></span><br>";
            }
            if ((typeof whofor === "undefined") || (whofor === "AC")) {
                var label = "ACchore" + i;
                ACchecklist += "<span><input class=\"chore_label\" type=\"checkbox\" onclick=\"totalpts(this.id)\" id=\"" + label + "\" value=\"" + objI[i].points + "\"><label class=\"chore_label\" for=\"" + label + "\">" + objI[i].desc + "<\label></span><br>";
            }
        }
    }
    //console.log(ODchecklist);
    document.getElementById("ODchores").innerHTML = ODchecklist;
    document.getElementById("AWchores").innerHTML = AWchecklist;
    document.getElementById("ACchores").innerHTML = ACchecklist;

} // parseChores
            
function showKeyVal(row, key, val) {
    console.log("Row:" + row + " Key:" + key + " Val:" + val);
} // showKeyVal

function totalpts(clicked_id) {
    //console.log("In totalptr: " + clicked_id);
    
    var boy = clicked_id.substring(0,2);
    
    // Not sure how many chores there will be
    var numchores = 20;
    var pttotal = 0;
    for (var i = 1; i < numchores; i++) {
        var cid = boy + "chore" + i;
        var chore = document.getElementById(cid);
        if ((chore === "undefined") || (chore === null)) {
            //console.log(pttotal);
        }
        else if (chore.checked === true) {
            //console.log(chore.value);
            pttotal += Number(chore.value);
        }
    }
    
    document.getElementById(boy + "pts").innerHTML = "<img class=\"chore_img\" src=\"images/coin.png\">" + pttotal;
} // totalpts

/*
function saveText(text, filename){
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

function kbs() {
var obj = {a: "Hello", b: "World"};
saveText( JSON.stringify(obj), "data/filename.json" );
}

*/