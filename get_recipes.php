<?php
// get_recipes.php
// This script fetches all recipes from the database and their associated ingredients.
// It aims to return a comprehensive list of recipes where each recipe object also contains its ingredients.

// Set CORS headers for frontend communication.
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type to JSON for the response.
header("Content-Type: application/json");

// Enable error reporting for development.
// Student Note: In production, this should be disabled or errors logged to a file.
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

// SQL query to fetch all recipes.
// Selecting all necessary fields directly (id, title, instructions, image_url, prep_time, cook_time).
$recipes_sql = "SELECT id, title, instructions, image_url, prep_time, cook_time FROM recipes ORDER BY title ASC"; // Added ORDER BY for consistency
$recipes_result = $conn->query($recipes_sql);

$recipes_array = []; // Initialize an array to hold all recipe data.

if ($recipes_result && $recipes_result->num_rows > 0) {
    // Prepare a statement for fetching ingredients to be reused for each recipe.
    // This is more efficient than creating a new query string inside the loop 
    $stmt_ingredients = $conn->prepare("SELECT id, name, quantity, unit FROM ingredients WHERE recipe_id = ?");

    while ($recipe_row = $recipes_result->fetch_assoc()) {
        $recipe_id = $recipe_row["id"];
        
        // Bind the current recipe_id to the prepared statement for ingredients.
        $stmt_ingredients->bind_param("i", $recipe_id);
        if (!$stmt_ingredients->execute()) {
            // Log error for ingredient fetching, but continue processing other recipes.
            // error_log("Failed to execute ingredient query for recipe_id {$recipe_id}: " . $stmt_ingredients->error);
            $recipe_row["ingredients"] = []; // Assign empty ingredients if fetch fails.
        } else {
            $ingredients_result = $stmt_ingredients->get_result();
            $ingredient_list = [];
            if ($ingredients_result->num_rows > 0) {
                while ($ingredient_row = $ingredients_result->fetch_assoc()) {
                    // Add each ingredient as an associative array (object in JSON).
                    $ingredient_list[] = $ingredient_row;
                }
            }
            $recipe_row["ingredients"] = $ingredient_list; // Assign the array of ingredient objects.
        }
        $recipes_array[] = $recipe_row; // Add the processed recipe to the main array.
    }
    $stmt_ingredients->close(); // Close the prepared statement for ingredients after the loop.
} else if (!$recipes_result) {
    // Handle query execution error for fetching recipes.
    http_response_code(500);
    echo json_encode(["error" => "Failed to retrieve recipes: " . $conn->error]);
    $conn->close();
    exit();
}

// Free the result set for recipes.
if ($recipes_result) {
    $recipes_result->free();
}

// Close the database connection.
$conn->close();

// Encode the final array of recipes into JSON and output it.
// If no recipes are found, an empty array is returned.
http_response_code(200); // OK.
echo json_encode($recipes_array);
?>
