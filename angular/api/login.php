<?php

header("Content-Type: application/json; charset=UTF-8");

// =============================
// CORS
// =============================

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle browser preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// =============================
// DATABASE
// =============================

require_once __DIR__ . "/db.php";

// =============================
// GET INPUT
// =============================

$input = json_decode(file_get_contents("php://input"), true);

$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// =============================
// VALIDATE
// =============================

if ($username === '' || $password === '') {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอก username และ password"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =============================
// QUERY USER
// =============================

$sql = "
SELECT 
    emp_id,
    username,
    password,
    name_thai,
    surname_thai,
    hrmi_id,
    role_id
FROM WINS_UNB.dbo.NEW_employee
WHERE username = ?
";

$stmt = sqlsrv_query($conn, $sql, [$username]);

if ($stmt === false) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "ระบบมีปัญหา (DB Error)",
        "errors" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =============================
// GET USER
// =============================

$row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

// =============================
// CHECK USER
// =============================

if (!$row) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Username หรือ Password ไม่ถูกต้อง"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =============================
// CHECK PASSWORD
// =============================

$dbPass = $row['password'];

$login_ok = false;

// รองรับ password hash
if (password_verify($password, $dbPass)) {
    $login_ok = true;
}

// fallback plain text
elseif ($password === $dbPass) {
    $login_ok = true;
}

// =============================
// LOGIN FAILED
// =============================

if (!$login_ok) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Username หรือ Password ไม่ถูกต้อง"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =============================
// LOGIN SUCCESS
// =============================

echo json_encode([
    "success" => true,
    "message" => "เข้าสู่ระบบสำเร็จ",

    "user" => [
        "emp_id"       => $row['emp_id'],
        "user_id"      => $row['emp_id'],
        "role_id"      => $row['role_id'],
        "username"     => $row['username'],
        "name_thai"    => $row['name_thai'],
        "surname_thai" => $row['surname_thai'],
        "hrmi_id"      => $row['hrmi_id']
    ]

], JSON_UNESCAPED_UNICODE);