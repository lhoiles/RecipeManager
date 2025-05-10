<?php
// delete_recipe.php
// This handles deleting a specific recipe from the database based on its ID.
// It expects a recipe ID, typically sent in the request body as JSON or as a query parameter.

// Set CORS headers for frontend communication.
// Note that consistent CORS handling across all API endpoints is important.
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Allowing DELETE for removing data and OPTIONS for preflight.
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // OK status for preflight.
    exit(); // Stop script execution.
}

// Set content type to JSON for the response.
header("Content-Type: application/json");

// Enable error reporting for development.
// In production, errors should be logged, not displayed directly to the user.
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Database connection parameters - consider moving these to a central config file for larger projects.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recipe_manager";

// Create database connection.
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection.
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error.
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Determine how the ID is being sent.
// let's assume it might come as a query parameter for DELETE, or JSON body
$recipe_id = null;

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // If DELETE request, try to get ID from query string first 
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $recipe_id = intval($_GET['id']);
    } else {
        // If not in query string, check the request body 
        $rawData = file_get_contents("php://input");
        $data = json_decode($rawData, true);
        if (isset($data["id"]) && !empty($data["id"])) {
            $recipe_id = intval($data["id"]);
        }
    }
}

// Validate if recipe ID was found and is a positive integer.
if (!$recipe_id || $recipe_id <= 0) {
    http_response_code(400); // Bad Request.
    echo json_encode(["error" => "Invalid or missing recipe ID."]);
    exit();
}

// Before deleting from the 'recipes' table we also need to delete associated ingredients
// from the 'ingredients' table to maintain referential integrity assuming there's a foreign key constraint.
// If ON DELETE CASCADE is set up in the database for the foreign key this happens automatically.
// If not manual deletion is required.

// Delete associated ingredients (if ON DELETE CASCADE is not used).
$stmt_delete_ingredients = $conn->prepare("DELETE FROM ingredients WHERE recipe_id = ?");
$stmt_delete_ingredients->bind_param("i", $recipe_id);

if (!$stmt_delete_ingredients->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete associated ingredients: " . $stmt_delete_ingredients->error]);
    $stmt_delete_ingredients->close();
    $conn->close();
    exit();
}
$stmt_delete_ingredients->close();

// Prepare and execute SQL statement to delete the recipe.
// Using prepared statements helps prevent SQL injection.
$stmt_delete_recipe = $conn->prepare("DELETE FROM recipes WHERE id = ?");
$stmt_delete_recipe->bind_param("i", $recipe_id); // "i" denotes the type integer.

// Execute the statement and check for errors.
if ($stmt_delete_recipe->execute()) {
    if ($stmt_delete_recipe->affected_rows > 0) {
        http_response_code(200); // OK.
        echo json_encode(["success" => true, "message" => "Recipe deleted successfully."]);
    } else {
        http_response_code(404); // Not Found.
        echo json_encode(["error" => "Recipe not found or already deleted."]);
    }
} else {
    http_response_code(500); // Internal Server Error.
    echo json_encode(["error" => "Error deleting recipe: " . $stmt_delete_recipe->error]);
}

// Close statement and connection.
$stmt_delete_recipe->close();
$conn->close();
?>
