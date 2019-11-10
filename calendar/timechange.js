// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(2019, 9); //Oct 2016

var logoutscreen = document.getElementById("logout-wrap");
logoutscreen.style.visibility = 'hidden';

var eventscreen = document.getElementById("event-wrap");
eventscreen.style.visibility = 'hidden';

var examplescreen = document.getElementById("example-wrap");
examplescreen.style.visibility = 'hidden';

var sharecalendarscreen = document.getElementById("sharecalendar");
sharecalendarscreen.style.visibility = 'hidden';

var groupeventsscreen = document.getElementById("groupevents");
groupeventsscreen.style.visibility = 'hidden';

//Initialize the calendar
 document.addEventListener("DOMContentLoaded", function(event) {
	 updateCalendar();
	 
	 fetch("onload.php", {
	         method: 'POST',
	         body: JSON.stringify(),
	         headers: { 'content-type': 'application/json' }
	     })
	     .then(response => response.json())
	     .then(data => onloadjudge(data))
	     .catch(error => console.error('Error:',error))
  });
  
  function onloadjudge(data){
  	if(data.success == true){
  		var loginscreen = document.getElementById("login-wrap");
  		loginscreen.style.visibility = 'hidden';
  		var logoutscreen = document.getElementById("logout-wrap");
  		logoutscreen.style.visibility = 'visible';
  		var registerscreen = document.getElementById("register-wrap");
  		registerscreen.style.visibility = 'hidden';
  		var eventscreen = document.getElementById("event-wrap");
  		eventscreen.style.visibility = 'visible';
		var examplescreen = document.getElementById("example-wrap");
		examplescreen.style.visibility = 'visible';
		var sharecalendarscreen = document.getElementById("sharecalendar");
		sharecalendarscreen.style.visibility = 'visible';
		var groupeventsscreen = document.getElementById("groupevents");
		groupeventsscreen.style.visibility = 'visible';
		document.getElementById("csrf_token").value=data.token;
		document.getElementById("csrf_token1").value=data.token;
		document.getElementById("csrf_token2").value=data.token;
  		insertEvent(event);
  	}else{
  		var loginscreen = document.getElementById("login-wrap");
  		loginscreen.style.visibility = 'visible';
  		var logoutscreen = document.getElementById("logout-wrap");
  		logoutscreen.style.visibility = 'hidden';
  		var registerscreen = document.getElementById("register-wrap");
  		registerscreen.style.visibility = 'visible';
  		var eventscreen = document.getElementById("event-wrap");
  		eventscreen.style.visibility = 'hidden';
		var examplescreen = document.getElementById("example-wrap");
		examplescreen.style.visibility = 'hidden';
		var sharecalendarscreen = document.getElementById("sharecalendar");
		sharecalendarscreen.style.visibility = 'visible';
		var groupeventsscreen = document.getElementById("groupevents");
		groupeventsscreen.style.visibility = 'hidden';
  	}
  }

// Change the month when the "prev" button is pressed
  document.getElementById("prev_month_btn").addEventListener("click", function(event){
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
	insertEvent(event);
  }, false);
  
// Change the month when the "next" button is pressed
  document.getElementById("next_month_btn").addEventListener("click", function(event){
  	currentMonth = currentMonth.nextMonth(); 
  	updateCalendar(); 
	insertEvent(event);
  }, false);

function updateCalendar(){
   var monthLists = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   // reset the page
   document.getElementById("dates").innerHTML="";

   // show the calendar title
   var m=currentMonth.month;
   var y=currentMonth.year;
   document.getElementById("header-title-month").innerHTML=monthLists[m] +' '+ y;
   var weeks = currentMonth.getWeeks();

	var weekticks=0;
	var dayticks=0;
	for(var w in weeks){
		  var days = weeks[w].getDates();
	   weekticks++;
	   var text = '<div class="week" id="week'+weekticks+'">';
			for(var d in days){
	      if(days[d].getMonth()==m){
	         dayticks++;
	         //add the date block
	         text += '<div class="day" id="day'+dayticks.toString()+m.toString()+y+'"><div class="day-number">'+days[d].getDate()+'</div></div>';
	      }else{
	         //add an empty block if it is null
	         text += '<div class="day-blank" name="day-blank"><div class="day-number"></div></div>';
	      }
			}
	   
	   text += '</div>';
	   document.getElementById("dates").innerHTML += text;
	}
}