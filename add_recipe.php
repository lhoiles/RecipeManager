//Create add_recipe.php
//This file will send new recipes (title, ingredients, instructions) from frontend into the database

<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Add any other headers your request might use

// Handle the preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Send an OK status for the preflight request
    exit();
}

// Allow cross-origin requests from frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Show PHP errors for debugging (disable in production)
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Connect to MySQL
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Handle connection errors
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Read and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate the main input fields
if (
    !$data ||
    !isset($data["title"]) ||
    !isset($data["instructions"]) ||
    !isset($data["ingredients"]) ||
    !is_array($data["ingredients"])
) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid data"]);
    exit;
}

// Extract fields
$title = $data["title"];
$instructions = $data["instructions"];
$ingredients = $data["ingredients"];

// Insert into recipes table (no ingredients column needed here)
$stmt = $conn->prepare("INSERT INTO recipes (title, instructions) VALUES (?, ?)");
$stmt->bind_param("ss", $title, $instructions);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to insert recipe"]);
    exit;
}

$recipe_id = $conn->insert_id;
$stmt->close();

// Insert ingredients
foreach ($ingredients as $ingredient) {
    // Validate ingredient fields
    if (
        !isset($ingredient["name"]) ||
        !isset($ingredient["quantity"]) ||
        !isset($ingredient["unit"])
    ) {
        continue; // skip invalid ingredients
    }

    $name = $ingredient["name"];
    $quantity = floatval($ingredient["quantity"]);
    $unit = $ingredient["unit"];

    $stmt_ing = $conn->prepare("INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)");
    $stmt_ing->bind_param("isds", $recipe_id, $name, $quantity, $unit);
    $stmt_ing->execute();
    $stmt_ing->close();
}

// Return success response
http_response_code(200);
echo json_encode(["success" => true, "message" => "Recipe and ingredients saved", "recipe_id" => $recipe_id]);

$conn->close();
?>
