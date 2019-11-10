function addEventAjax(event) {
    const title = document.getElementById("event-title").value; 
    const year = document.getElementById("event-year").value; 
	const month = document.getElementById("event-month").value; 
	const date = document.getElementById("event-date").value; 
	const hour = document.getElementById("event-hour").value; 
	const content = document.getElementById("event-content").value; 
	const tag = document.getElementById("event-tag").value; 
	const token = document.getElementById("csrf_token").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'year': year, 'month': month,'date': date,'hour':hour, 'content': content,'tag': tag,'token':token};

    fetch("addevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => addeventjudge(data))
        .catch(error => console.error('Error:',error))
}

function addeventjudge(data){
	if(data.success == true){
		alert("Add event success!");
		updateCalendar();
		insertEvent(event);
	}else{
		alert(data.message);
	}
}

function insertEvent(event){
	var m=currentMonth.month;
	var y=currentMonth.year; 
	const token = document.getElementById("csrf_token").value;
	
	const data = { 'currentMonth': m, 'currentYear': y,'token':token};
	
	fetch("insertevent.php", {
	        method: 'POST',
	        body: JSON.stringify(data),
	        headers: { 'content-type': 'application/json' }
	    })
	    .then(response => response.json())
	    .then(data => applyinsert(data))
	    .catch(error => console.error('Error:',error))
}

function applyinsert(data){
	if(data.success == true){
		for (var i=0; i < data.datas.length; i++){
			var monthadjust=data.datas[i].month-1;
			var elementId="day"+data.datas[i].date+monthadjust+data.datas[i].year;
			var text = '<div><input type="button" class="'+data.datas[i].tag+'" id="'+data.datas[i].id+'" value="'+data.datas[i].title+
			'"/><a href="javascript:void(0);" id="X'+data.datas[i].id+'">X</a></div>';
			document.getElementById(elementId).innerHTML += text;
		}
		for(var j=0; j < data.datas.length; j++){
			var id='#'+data.datas[j].id;
			var Xid='#X'+data.datas[j].id;
			$(id).bind("click", {content: data.datas[j].content, title:data.datas[j].title, year:data.datas[j].year, 
			month:data.datas[j].month, date:data.datas[j].date, tag:data.datas[j].tag, id:data.datas[j].id,
			hour:data.datas[j].hour, groups:data.datas[j].groups, member:data.datas[j].member}, click);
			$(Xid).bind("click", {value: data.datas[j].id}, deleteevent);
		}
	}else{
		alert("System is busy!");
	}
}

    function click(event) {
        var showcontent = event.data.content;
		var afternoontime = event.data.hour-12;
		var groupjudge = event.data.groups;
		var membername = event.data.member;
		if(event.data.hour>12 && groupjudge==0){
			var text = '<div class="showcontent">'+showcontent+'</div><br><br><div>'+afternoontime+":00 p.m."+'</div>';
		}else if(event.data.hour<13 && groupjudge==0){
			var text = '<div class="showcontent">'+showcontent+'</div><br><br><div>'+event.data.hour+":00 a.m."+'</div>';
		}else if(event.data.hour<13 && groupjudge==1){
			var text = '<div class="showcontent">'+showcontent+'</div><br><br><div>'+event.data.hour+":00 a.m."+'</div>'
			+'<div>group event</div>'+'<div>created by:'+membername+'</div>';
		}else if(event.data.hour>12 && groupjudge==1){
			var text = '<div class="showcontent">'+showcontent+'</div><br><br>'+'<div>'+afternoontime+":00 p.m."+'</div>'
			+'<div>group event</div>'+'<div>created by:'+membername+'</div>';
		}
		document.getElementById("mydialog").innerHTML = text;
		document.getElementById("event-title").value = event.data.title;
		document.getElementById("event-year").value = event.data.year;
		document.getElementById("event-month").value = event.data.month;
		document.getElementById("event-date").value = event.data.date;
		document.getElementById("event-hour").value = event.data.hour;
		document.getElementById("event-tag").value = event.data.tag;
		document.getElementById("event-content").value = event.data.content;
		document.getElementById("hidden").value = event.data.id;
		$("#mydialog").dialog();
	}
	
	function deleteevent(event){
		var eventid = event.data.value;
		const data = { 'eventid': eventid};
		
		fetch("delete.php", {
			        method: 'POST',
			        body: JSON.stringify(data),
			        headers: { 'content-type': 'application/json' }
			    })
			    .then(response => response.json())
			    .then(data => applydelete(data))
			    .catch(error => console.error('Error:',error))
		}
	
	function applydelete(data){
		if(data.success == true){
			alert("delete event success!");
			updateCalendar();
			insertEvent(event);
		}else{
			alert("System is busy!");
		}
	}
	
function modifyEventAjax(event) {
    const title = document.getElementById("event-title").value; 
    const year = document.getElementById("event-year").value; 
	const month = document.getElementById("event-month").value; 
	const date = document.getElementById("event-date").value; 
	const hour = document.getElementById("event-hour").value; 
	const content = document.getElementById("event-content").value; 
	const tag = document.getElementById("event-tag").value; 
	const id=document.getElementById("hidden").value;
	const token = document.getElementById("csrf_token").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'year': year, 'month': month,'date': date, 'hour':hour, 'content': content,'tag': tag,'id': id,'token':token};

    fetch("modifyevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => modifyjudge(data))
        .catch(error => console.error('Error:',error))
}

	function modifyjudge(data){
		if(data.success == true){
			alert("modify event success!");
			updateCalendar();
			insertEvent(event);
		}else{
			alert(data.message);
		}
	}

function shareEventAjax(event) {
    const name = document.getElementById("friend-name").value; 
    const token = document.getElementById("csrf_token1").value;
	
    // Make a URL-encoded string for passing POST data:
    const data = { 'name': name,'token':token};

    fetch("shareevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => shareapply(data))
        .catch(error => console.error('Error:',error))
}

function shareapply(data){
		if(data.success == true){
			alert("share calendar success!");
		}else{
			alert(data.message);
		}
	}
	
function groupEventAjax(event) {
	const title = document.getElementById("group-title").value;
	const year = document.getElementById("group-year").value; 
	const month = document.getElementById("group-month").value; 
	const date = document.getElementById("group-date").value; 
	const hour = document.getElementById("group-hour").value; 
	const tag = document.getElementById("group-tag").value; 
	const content = document.getElementById("group-content").value; 
	const names = document.getElementById("member-name").value; 
	const token = document.getElementById("csrf_token2").value;
	
	// Make a URL-encoded string for passing POST data:
	const data = { 'title': title, 'year': year, 'month': month,'date': date,'hour':hour, 'tag':tag, 'content': content,'names': names,'token':token};
	
	fetch("groupevent.php", {
	        method: 'POST',
	        body: JSON.stringify(data),
	        headers: { 'content-type': 'application/json' }
	    })
	    .then(response => response.json())
	    .then(data => groupapply(data))
	    .catch(error => console.error('Error:',error))
}

function groupapply(data){
		if(data.success == true){
			alert("cerate group events success!");
			updateCalendar();
			insertEvent(event);
		}else{
			alert(data.message);
		}
	}
	
document.getElementById("sharebutton").addEventListener("click", shareEventAjax, false);
document.getElementById("addevent_btn").addEventListener("click", addEventAjax, false);
document.getElementById("modify_btn").addEventListener("click", modifyEventAjax, false);
document.getElementById("groupbutton").addEventListener("click", groupEventAjax, false);
