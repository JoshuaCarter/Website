<?php

//header('Access-Control-Allow-Origin: *');
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("secrets.php");

class DB {

	private static $db = null;

	public static function connect() {
		//self::$db = mysqli_connect("localhost", "root", "", "db");
		self::$db = mysqli_connect(Secrets::$db_url, Secrets::$db_user, Secrets::$db_pass, Secrets::$db_name);

		if (mysqli_connect_error()) {
			die("not connect: ". mysqli_connect_error() ."(". mysqli_errno() .")");
		}

		return self::$db;
	}

	public static function close() {
		if(isset(self::$db)) {
			mysqli_close(self::$db);
		}
	}

	public static function is_connected() {
		return isset(self::$db);
	}

	public static function query($query) {
		return mysqli_query(self::$db, $query);
	}

	public static function fetch_assoc($result) {
		return mysqli_fetch_assoc($result);
	}

	public static function rows_affected() {
		return mysqli_affected_rows(self::$db);
	}

	public static function last_insert_id() {
		return mysqli_insert_id(self::$db);
	}

	public static function err_no() {
		return mysqli_errno(self::$db);
	}

	public static function err_msg() {
		return mysqli_error(self::$db);
	}
}

function insertScore($name, $score, $rows) {
	//insert new score
	$q = "INSERT INTO scores (name, score) VALUES ('$name', $score)";
	$r = DB::query($q);

	//get rank of new score
	$id = DB::last_insert_id();
	$q = "
		SELECT x.name, x.score, x.rank FROM (
			SELECT 	y.primary_key,
					y.name,
					y.score, 
					@rank := @rank + 1 AS rank
			FROM scores AS y
			JOIN (
				SELECT @rank := 0
			) AS z
			ORDER BY score DESC
		) AS x
		WHERE x.primary_key = $id";
	$r = DB::query($q);

	//calc offset from rank
	$rank = DB::fetch_assoc($r)['rank'];
	$offset = floor($rank / $rows);
	return $offset;
}

function fetchScores($offset, $rows) {
	//post response data
	$data = [];
	
	$q = "SELECT COUNT(*) AS total_rows FROM scores";
	$r = DB::query($q);

	//header data about current page and last page
	$lp = ceil(DB::fetch_assoc($r)['total_rows'] / $rows) - 1;
	array_push($data, array(
		"page" => $offset,
		"last_page" => $lp
	));

	//get scores
	$off = $offset * $rows;
	$q = "SELECT * FROM scores ORDER BY score DESC LIMIT $off, $rows";
	$r = DB::query($q);

	//push scores into data
	while($item = DB::fetch_assoc($r)) {
		array_push($data, array(
			"name" => $item['name'],
			"score" => $item['score'], 
		));
	}

	//encode and send data
	echo json_encode($data);
}

function searchScores($name, $rows) {
	$data = [];

	$q = "
		SELECT x.name, x.score, x.rank FROM (
			SELECT 	y.primary_key,
					y.name,
					y.score, 
					@rank := @rank + 1 AS rank
			FROM scores AS y
			JOIN (
				SELECT @rank := 0
			) AS z
			ORDER BY score DESC
		) AS x
		WHERE x.name = '$name'
		ORDER BY x.rank ASC
		LIMIT $rows";
	$r = DB::query($q);

	if($r) {
		while($item = DB::fetch_assoc($r)) {
			array_push($data, array(
				"name" => $item['name'],
				"score" => $item['score'],
				"rank" => $item['rank'],
			));
		}
	}

	echo json_encode($data);
}

function populate($data, $count) {
	for($i = 0; $i < $count; $i++) {
		$name = $data[$i]['name'];
		$score = $data[$i]['score'];
		$q = "INSERT INTO scores (name, score) VALUES ('$name', $score)";
		$r = DB::query($q);
	}
}

function run() {
	DB::connect();

	if(DB::is_connected()) {
		$json = file_get_contents("php://input");
		$packet = json_decode($json, true);

		//if recieved packet
		if(isset($packet)) {
			//SCORE PACKET
			if($packet['type'] == "score") {
				//insert new scores
				if($packet['action'] == "insert_fetch") {
					$offset = insertScore($packet['name'], $packet['score'], $packet['rows']);
					fetchScores($offset, $packet['rows']);
				}
				//fetch scores
				else if($packet['action'] == "fetch") {
					fetchScores($packet['offset'], $packet['rows']);
				}
				//search for scores
				else if($packet['action'] == "search") {
					searchScores($packet['name'], $packet['rows']);
				}
			}
			//POPULATE PACKET
			else if($packet['type'] == "populate") {
				populate($packet['data'], $packet['count']);
			}
		}
	}

	DB::close();
}

run();

?>