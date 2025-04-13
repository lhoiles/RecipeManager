//Create add_recipe.php
//This file will send new recipes (title, ingredients, instructions) from frontend into the database

<?php
// Allow requests from any domain and accept POST method
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the raw JSON input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Extract title, ingredients, and instructions from the input
$title = $data["title"];
$ingredients = $data["ingredients"];
$instructions = $data["instructions"];

// SQL query to insert the new recipe
$sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)";

// Prepare the statement to avoid SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $title, $ingredients, $instructions);

// Run the query and send back success/failure
if ($stmt->execute()) {
    echo json_encode(["message" => "Recipe added successfully"]);
} else {
    echo json_encode(["error" => "Error adding recipe"]);
}

// Close connection
$stmt->close();
$conn->close();
?>

