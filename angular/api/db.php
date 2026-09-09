<?php

date_default_timezone_set("Asia/Bangkok");

$serverName = "localhost\\SQLEXPRESS";

$connectionOptions = array(
    "Database" => "WINS_UNB",
    "CharacterSet" => "UTF-8",
    "TrustServerCertificate" => true
);

$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}