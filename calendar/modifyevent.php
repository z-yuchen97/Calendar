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
		
		//select database
		$mysqli = new mysqli('localhost', 'zyc', '19970108', 'calendar');
			if($mysqli->connect_errno) {
				printf("Connection Failed: %s\n", $mysqli->connect_error);
				exit;
			}
					
		//Variables can be accessed as such:
		$title = $json_obj['title'];
		$year = $json_obj['year'];
		$month = $json_obj['month'];
		$date = $json_obj['date'];
		$hour = $json_obj['hour'];
		$content = $json_obj['content'];
		$tag = $json_obj['tag'];
		$id = $json_obj['id'];
		$token = $json_obj['token'];
		$username = $_SESSION['username'];
		
		if(!hash_equals($_SESSION['token'], $token)){
			die("Request forgery detected");
		}
		
		$hourinday=array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23);
		$datesinmonth1=array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
		,25,26,27,28,29,30,31);  
		$datesinmonth2=array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
		,25,26,27,28,29,30);
		$datesinmonth3=array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
		,25,26,27,28,29);
		$datesinmonth4=array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
		,25,26,27,28);
		if($year % 400 == 0 || ($year % 4 == 0 && $year % 100 != 0)){
			$leapyear=1;
		}else{
			$leapyear=0;
		}
		//title/month/year/date/content cannot be null and check their validity
		if($title==null){
			echo json_encode(array(
				"success" => false,
				"message" => "title can not be null!"
			));
			exit;
		}else if($year==null or $year<1 or is_int($year)){
			echo json_encode(array(
				"success" => false,
				"message" => "year can not be null or minus!"
			));
			exit;
		}else if($month==null) {
			echo json_encode(array(
				"success" => false,
				"message" => "month can not be null!"
			));
			exit;
        }else if($date==null){
			echo json_encode(array(
				"success" => false,
				"message" => "date can not be null!"
			));
			exit;
		}else if($content==null){
			echo json_encode(array(
				"success" => false,
				"message" => "content can not be null!"
			));
			exit;
		}else if(!($month==1 or $month==2 or $month==3 or $month==4 or $month==5 or $month==6 or $month==7 or
		$month==8 or $month==9 or $month==10 or $month==11 or $month==12)){
			echo json_encode(array(
				"success" => false,
				"message" => "Please check the month!(incorrect number)"
			));
			exit;
		}else if(!is_numeric($year)){
			echo json_encode(array(
				"success" => false,
				"message" => "year is not a number!"
			));
			exit;
		}else if(!is_numeric($month)){
			echo json_encode(array(
				"success" => false,
				"message" => "month is not a number!"
			));
			exit;
		}else if(!is_numeric($date)){
			echo json_encode(array(
				"success" => false,
				"message" => "date is not a number!"
			));
			exit;
		}else if(($month==1 or $month==3 or $month==5 or $month==7 or $month==8 or $month==10 or $month==12)and !in_array($date,$datesinmonth1)){
			echo json_encode(array(
				"success" => false,
				"message" => "Invalid date!"
			));
			exit;
		}else if(($month==4 or $month==6 or $month==9 or $month==11) and !in_array($date,$datesinmonth2)){
			echo json_encode(array(
				"success" => false,
				"message" => "Invalid date!"
			));
			exit;
		}else if($leapyear==1 and $month==2 and !in_array($date,$datesinmonth3)){
			echo json_encode(array(
				"success" => false,
				"message" => "Invalid date!"
			));
			exit;
		}else if($leapyear==0 and $month==2 and !in_array($date,$datesinmonth4)){
			echo json_encode(array(
				"success" => false,
				"message" => "Invalid date!"
			));
			exit;
		}else if($tag==null){
			echo json_encode(array(
				"success" => false,
				"message" => "category can not be null!"
			));
			exit;
		}else if(!($tag=="study" or $tag=="work" or $tag=="entertainment" or $tag=="other")){
			echo json_encode(array(
				"success" => false,
				"message" => "category you input is not supported!"
			));
			exit;
		}else if($hour==null){
			echo json_encode(array(
				"success" => false,
				"message" => "hour can not be null!"
			));
			exit;
		}else if(!in_array($hour,$hourinday)){
			echo json_encode(array(
				"success" => false,
				"message" => "Invalid hour!"
			));
			exit;
		}
        
		//insert the datas of event into database
		$stmt = $mysqli->prepare("UPDATE events set title=?, year=?, month=?, date=?, content=?, tag=?, hour=? WHERE id=? AND username=?");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('siiissiis',$title, $year, $month, $date, $content, $tag, $hour, $id, $username);
		$stmt->execute();
		if(true){
		echo json_encode(array(
			"success" => true
		));
		exit;
		}
		$stmt->close();
?>