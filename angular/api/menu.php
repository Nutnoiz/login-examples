<?php

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/db.php";

// ================== GET USER ==================

$user_id = isset($_GET['user_id'])
    ? (int)$_GET['user_id']
    : 0;

$role_id = isset($_GET['role_id'])
    ? (int)$_GET['role_id']
    : 0;


// ================== VALIDATE ==================

if ($user_id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid user_id"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ================== LOAD MENU ==================

if ($role_id == 2) {

    // ==============================
    // ROLE 2 = FULL MENU
    // ==============================

    $sql = "
        SELECT
            menu_id,
            menu_name,
            page,
            icon,
            parent_id,
            sort_order
        FROM WINS_UNB.dbo.NEW_Menu
        WHERE is_active = 1
        ORDER BY parent_id, sort_order
    ";

    $stmt = sqlsrv_query($conn, $sql);

} else {

    // ==============================
    // NORMAL USER
    // ==============================

    $sql = "
        SELECT DISTINCT
            m.menu_id,
            m.menu_name,
            m.page,
            m.icon,
            m.parent_id,
            m.sort_order
        FROM WINS_UNB.dbo.NEW_Menu m
        WHERE m.is_active = 1
        AND (
            m.menu_id = 1

            OR m.menu_id IN (
                SELECT menu_id
                FROM WINS_UNB.dbo.NEW_user_menu
                WHERE user_id = ?
            )

            OR m.menu_id IN (
                SELECT DISTINCT parent_id
                FROM WINS_UNB.dbo.NEW_Menu
                WHERE parent_id IS NOT NULL
                AND menu_id IN (
                    SELECT menu_id
                    FROM WINS_UNB.dbo.NEW_user_menu
                    WHERE user_id = ?
                )
            )
        )
        ORDER BY m.parent_id, m.sort_order
    ";

    $params = [
        $user_id,
        $user_id
    ];

    $stmt = sqlsrv_query(
        $conn,
        $sql,
        $params
    );
}


// ================== DB ERROR ==================

if ($stmt === false) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Menu query failed",
        "errors" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ================== FETCH ==================

$menus = [];

while (
    $row = sqlsrv_fetch_array(
        $stmt,
        SQLSRV_FETCH_ASSOC
    )
) {

    $menus[] = [
        "menu_id"   => (int)$row["menu_id"],
        "menu_name" => $row["menu_name"],
        "page"      => $row["page"],
        "icon"      => $row["icon"],
        "parent_id" => $row["parent_id"] !== null
            ? (int)$row["parent_id"]
            : null,
        "sort_order" => (int)$row["sort_order"]
    ];
}


// ================== RESPONSE ==================

echo json_encode([
    "success" => true,
    "message" => "Menu loaded successfully",
    "menus"   => $menus
], JSON_UNESCAPED_UNICODE);