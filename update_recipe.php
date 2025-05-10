<?php
// update_recipe.php
// This script handles updating an existing recipe and its ingredients in the database
// It expects the recipe ID and updated data in JSON format from the frontend via a PUT request

// Set CORS headers for frontend communication.
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Allowing PUT for updates and OPTIONS for preflight.
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // OK status for preflight.
    exit(); // Stop script execution.
}

// Set content type to JSON for the response.
header("Content-Type: application/json");

// Enable error reporting for development.
// Note: In production, errors should be logged, not displayed.
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Database connection parameters.
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

// Read the raw PUT data (JSON string) from the request body.
$rawData = file_get_contents("php://input");
// Decode the JSON string into a PHP associative array.
$data = json_decode($rawData, true);

// Validate incoming data.
if (
    !$data ||
    !isset($data["id"]) || !is_numeric($data["id"]) || intval($data["id"]) <= 0 || // ID must be a positive number.
    !isset($data["title"]) || empty(trim($data["title"])) ||
    !isset($data["instructions"]) || empty(trim($data["instructions"])) ||
    !isset($data["ingredients"]) || !is_array($data["ingredients"]) 
    // Optional fields like image_url, prep_time, cook_time can be checked if they have specific validation rules when present.
) {
    http_response_code(400); // Bad Request.
    echo json_encode(["error" => "Missing or invalid recipe data for update. ID, title, instructions, and ingredients array are required."]);
    exit();
}

// Extract data.
$recipe_id = intval($data["id"]);
$title = trim($data["title"]);
$instructions = trim($data["instructions"]);
$imageUrl = isset($data["image_url"]) ? trim($data["image_url"]) : null;
$prepTime = isset($data["prep_time"]) ? trim($data["prep_time"]) : null;
$cookTime = isset($data["cook_time"]) ? trim($data["cook_time"]) : null;
$ingredients = $data["ingredients"];

// Begin transaction for atomicity: update recipe, delete old ingredients, insert new ingredients.
$conn->begin_transaction();

// Update the main recipe details in the 'recipes' table.
// Using prepared statements to prevent SQL injection.
$stmt_update_recipe = $conn->prepare("UPDATE recipes SET title = ?, instructions = ?, image_url = ?, prep_time = ?, cook_time = ? WHERE id = ?");
$stmt_update_recipe->bind_param("sssssi", $title, $instructions, $imageUrl, $prepTime, $cookTime, $recipe_id);

if (!$stmt_update_recipe->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update recipe: " . $stmt_update_recipe->error]);
    $conn->rollback(); // Rollback transaction on error.
    $stmt_update_recipe->close();
    $conn->close();
    exit();
}
$stmt_update_recipe->close();

// Delete existing ingredients for this recipe.
// Note to self: This is a common strategy for updates: delete all related items and then re-insert the new set.
// This simplifies logic compared to trying to update, insert, and delete individual ingredients.
$stmt_delete_ingredients = $conn->prepare("DELETE FROM ingredients WHERE recipe_id = ?");
$stmt_delete_ingredients->bind_param("i", $recipe_id);

if (!$stmt_delete_ingredients->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to clear old ingredients: " . $stmt_delete_ingredients->error]);
    $conn->rollback(); // Rollback transaction.
    $stmt_delete_ingredients->close();
    $conn->close();
    exit();
}
$stmt_delete_ingredients->close();

// Insert the new set of ingredients.
$allIngredientsInserted = true;
if (!empty($ingredients)) {
    $stmt_insert_ingredient = $conn->prepare("INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)");
    foreach ($ingredients as $ingredient) {
        if (
            !isset($ingredient["name"]) || empty(trim($ingredient["name"])) ||
            !isset($ingredient["quantity"]) ||
            !isset($ingredient["unit"])
        ) {
            // error_log("Skipping invalid ingredient during update for recipe_id {$recipe_id}: " . json_encode($ingredient));
            continue; // Skip invalid ingredient data.
        }
        $name = trim($ingredient["name"]);
        $quantity = strval($ingredient["quantity"]); // Assuming quantity can be varied string or number
        $unit = trim($ingredient["unit"]);
        $stmt_insert_ingredient->bind_param("isss", $recipe_id, $name, $quantity, $unit);
        if (!$stmt_insert_ingredient->execute()) {
            $allIngredientsInserted = false;
            // error_log("Failed to insert ingredient during update for recipe_id {$recipe_id}: " . $stmt_insert_ingredient->error);
            break; // Stop if one ingredient fails.
        }
    }
    $stmt_insert_ingredient->close();
}

// Commit or rollback the transaction based on success.
if ($allIngredientsInserted) {
    $conn->commit();
    http_response_code(200); // OK.
    echo json_encode(["success" => true, "message" => "Recipe updated successfully."]);
} else {
    $conn->rollback();
    http_response_code(500);
    // Provide a more specific error if possible, or a general one.
    echo json_encode(["error" => "Failed to update ingredients. Recipe update rolled back."]);
}

// Close the database connection.
$conn->close();
?>
