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
		
		$sharename = $json_obj['name'];
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
					
		//name cannot be empty and has regular expression restrictions
		
		if($sharename==null){
			echo json_encode(array(
				"success" => false,
				"message" => "Name can not be null!"
			));
			exit;
		}else if($sharename==$username){
			echo json_encode(array(
				"success" => false,
				"message" => "you cannot share the calendar to yourself!"
			));
			exit;
		}
        
        // Check if the name already exists
        $stmt = $mysqli->prepare("SELECT username FROM users WHERE username=?");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('s', $sharename);
		$stmt->execute();
		$stmt->bind_result($sun);
        $stmt->fetch();
        if (!htmlspecialchars($sun)) {
			echo json_encode(array(
				"success" => false,
				"message" => "name does not exist!"
			));
			exit;
        }
		$stmt->close();
    
		$stmt = $mysqli->prepare("INSERT INTO events (SELECT NULL, ?, title, year, month, date, content, tag, hour, groups, member FROM events WHERE username = ?)");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('ss', $sharename, $username);
		$stmt->execute();
		if(true){
		echo json_encode(array(
			"success" => true
		));
		exit;
		}
		$stmt->close();
?>