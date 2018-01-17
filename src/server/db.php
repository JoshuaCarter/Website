<?php

//header('Access-Control-Allow-Origin: *');
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once("secrets.php");

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

	public static function sanitize($string) {
		return mysqli_real_escape_string(self::$db, $string);
	}
}

?>