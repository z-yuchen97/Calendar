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
		
		$eventid = $json_obj['eventid'];
		
		//select database
		$mysqli = new mysqli('localhost', 'zyc', '19970108', 'calendar');
			if($mysqli->connect_errno) {
				printf("Connection Failed: %s\n", $mysqli->connect_error);
				exit;
			}
					
		//delete the user's events datas
		$stmt = $mysqli->prepare("DELETE FROM events WHERE id=?");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('i', $eventid);
		$stmt->execute();
		if(true){
		echo json_encode(array(
			"success" => true
		));
		exit;
		}
		$stmt->close();
?>