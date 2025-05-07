//Create delete_recipe.php
//This will will let me delete a recipe by its ID

<?php

header('Access-Control-Allow-Origin: http://localhost:3000'); // Or use '*' for any origin, but specifying is more secure
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE'); // Add DELETE or the methods you use
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Make sure Content-Type is included

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Stop script execution after sending headers for preflight requests
    exit(0);
}

// Allow cross-origin and DELETE method
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "recipe_manager");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the raw input and decode JSON
$data = json_decode(file_get_contents("php://input"), true);

// Extract the recipe ID
$id = $data["id"];

// Prepare SQL to delete the recipe
$sql = "DELETE FROM recipes WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

// Execute and return result
if ($stmt->execute()) {
    echo json_encode(["message" => "Recipe deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting recipe"]);
}

$stmt->close();
$conn->close();
?>
