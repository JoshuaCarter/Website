<?php

require_once("db.php");

function insertScore($name, $score, $rows) {
	//sanitize
	$name = DB::sanitize($name);
	$score = DB::sanitize($score);
	$rows = DB::sanitize($rows);

	//insert new score into db
	$q = "INSERT INTO scores (name, score) VALUES ('$name', $score)";
	$r = DB::query($q);

	//query db for rank of new score
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

	//calc offset (page) from rank
	$rank = DB::fetch_assoc($r)['rank'];
	$offset = floor($rank / $rows);
	return $offset;
}

function fetchScores($offset, $rows) {
	//sanitize
	$offset = DB::sanitize($offset);
	$rows = DB::sanitize($rows);

	//return data
	$data = [];
	
	//query db for number of scores
	$q = "SELECT COUNT(*) AS total_rows FROM scores";
	$r = DB::query($q);

	//calculate last page (rows is rows per page)
	$lp = ceil(DB::fetch_assoc($r)['total_rows'] / $rows) - 1;
	//push into return data array
	array_push($data, array(
		"page" => $offset,
		"last_page" => $lp
	));

	//offset (page)
	$off = $offset * $rows;
	//query db for ordered page of scores
	$q = "SELECT * FROM scores ORDER BY score DESC LIMIT $off, $rows";
	$r = DB::query($q);

	//push scores into data
	while($item = DB::fetch_assoc($r)) {
		array_push($data, array(
			"name" => $item['name'],
			"score" => $item['score'], 
		));
	}

	//encode and send data to client
	echo json_encode($data);
}

function searchScores($name, $rows) {
	//sanitize
	$name = DB::sanitize($name);
	$rows = DB::sanitize($rows);

	//return data
	$data = [];

	//query db for matching names sorted by rank
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
		//push query results into return data array
		while($item = DB::fetch_assoc($r)) {
			array_push($data, array(
				"name" => $item['name'],
				"score" => $item['score'],
				"rank" => $item['rank'],
			));
		}
	}

	//return results to client
	echo json_encode($data);
}

function populate($data, $count) {
	//for each data
	for($i = 0; $i < $count; $i++) {
		//santize data
		$name = DB::sanitize($data[$i]['name']);
		$score = DB::sanitize($data[$i]['score']);
		//insert into db
		$q = "INSERT INTO scores (name, score) VALUES ('$name', $score)";
		$r = DB::query($q);
	}
}

function run() {
	//connect to db
	DB::connect();

	//if db connected
	if(DB::is_connected()) {
		//fetch json packet
		$json = file_get_contents("php://input");
		$packet = json_decode($json, true);

		//if recieved packet
		if(isset($packet)) {
			//IS SCORE PACKET
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
			//IS POPULATE PACKET
			else if($packet['type'] == "populate") {
				populate($packet['data'], $packet['count']);
			}
		}
	}

	//close db
	DB::close();
}

//run script
run();

?>