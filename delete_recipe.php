Create delete_recipe.php
This will will let me delete a recipe by its ID

<?php
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
