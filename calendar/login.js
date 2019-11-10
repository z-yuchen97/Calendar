function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => loginjudge(data))
        .catch(error => console.error('Error:',error))
}

function loginjudge(data){
	if(data.success == true){
		alert("login success!");
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
		alert(data.message);
	}
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false);

function logoutAjax(event) {
	fetch("logout.php", {
	        method: 'POST',
	        body: JSON.stringify(),
	        headers: { 'content-type': 'application/json' }
	    })
	    .then(response => response.json())
	    .then(data => logoutjudge(data))
	    .catch(error => console.error('Error:',error))
	}
	
function logoutjudge(data){
	if(data.success == true){
		alert("logout success!");
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
		sharecalendarscreen.style.visibility = 'hidden';
		var groupeventsscreen = document.getElementById("groupevents");
		groupeventsscreen.style.visibility = 'hidden';
		updateCalendar();
	}else{
		alert("logout failed!");
	}
}
	
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false);

function registerAjax(event) {
	const registername = document.getElementById("registername").value; 
	const registerpassword = document.getElementById("registerpassword").value; 
	
	const data = { 'registername': registername, 'registerpassword': registerpassword };
	 
	fetch("register.php", {
	        method: 'POST',
	        body: JSON.stringify(data),
	        headers: { 'content-type': 'application/json' }
	    })
	    .then(response => response.json())
	    .then(data => registerjudge(data))
	    .catch(error => console.error('Error:',error))
	}
	
function registerjudge(data){
	if(data.success == true){
		alert("register success!");
	}else{
		alert(data.message);
	}
}

document.getElementById("register_btn").addEventListener("click", registerAjax, false);