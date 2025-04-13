Create update_recipe.php
This will allow me to edit an existing recipe by its ID

<?php
// Allow cross-origin requests and allow PUT method
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Get data from request
$id = $data["id"];
$title = $data["title"];
$ingredients = $data["ingredients"];
$instructions = $data["instructions"];

// Prepare the SQL query to update the recipe
$sql = "UPDATE recipes SET title=?, ingredients=?, instructions=? WHERE id=?";

// Use prepared statements to avoid SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $title, $ingredients, $instructions, $id);

// Execute and return result
if ($stmt->execute()) {
    echo json_encode(["message" => "Recipe updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating recipe"]);
}

$stmt->close();
$conn->close();
?>
