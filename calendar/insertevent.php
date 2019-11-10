<?php 
        ini_set("session.cookie_httponly", 1);
        session_start();
		$previous_ua = @$_SESSION['useragent'];
		$current_ua = $_SERVER['HTTP_USER_AGENT'];
		
		if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
			die("Session hijack detected");
		}else{
			$_SESSION['useragent'] = $current_ua;
		}
		
		header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
		
		//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
		$json_str = file_get_contents('php://input');
		//This will store the data into an associative array
		$json_obj = json_decode($json_str, true);
		
		$currentMonth = $json_obj['currentMonth']+1;
		$currentYear = $json_obj['currentYear'];
		$token = $json_obj['token'];
		$username = $_SESSION['username'];
		
		if(!hash_equals($_SESSION['token'], $token)){
			die("Request forgery detected");
		}
		
		//select database
		$mysqli = new mysqli('localhost', 'zyc', '19970108', 'calendar');
			if($mysqli->connect_errno) {
				printf("Connection Failed: %s\n", $mysqli->connect_error);
				exit;
			}
					
		//fetch the user's events datas
		$stmt = $mysqli->prepare("SELECT title, year, month, date, content, id, tag, hour, groups, member FROM events WHERE username=? AND month=? AND year=?");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('sii', $username, $currentMonth, $currentYear);
		$stmt->execute();
		$result = $stmt->get_result();	
		$data = array();
		while($row = $result->fetch_assoc()){
			array_push($data, array(
			    "title" => htmlentities($row['title']),
			    "year" => htmlentities($row['year']),
			    "month" => htmlentities($row['month']),
			    "date" => htmlentities($row['date']),
			    "content" => htmlentities($row['content']),
				"id" => htmlentities($row['id']),
				"tag" => htmlentities($row['tag']),
				"hour" => htmlentities($row['hour']),
				"groups" => htmlentities($row['groups']),
				"member" => htmlentities($row['member'])
			));
		}
		if(true){
		echo json_encode(array(
			"success" => true,
			"datas" => $data
		));
		exit;
		}
		$stmt->close();
?>