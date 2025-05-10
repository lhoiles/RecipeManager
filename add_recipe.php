<?php
// add_recipe.php
// This script handles adding a new recipe with its ingredients to the database.
// It receives data in JSON format from the frontend.

// Set CORS headers to allow requests from the frontend development server.
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allowing POST for adding data and OPTIONS for preflight requests.
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Specify allowed headers.

// Handle preflight OPTIONS request.
// Browsers send an OPTIONS request before a POST request to check CORS permissions.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with OK to preflight request.
    exit(); // Terminate script execution after handling preflight.
}

// Set content type to JSON for the response.
header("Content-Type: application/json");

// Enable error reporting for development purposes.
// Note that this should be disabled or logged to a file in a production environment for security reasons.
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Database connection parameters
$servername = "localhost"; // Usually localhost for local development.
$username = "root";        
$password = "";            
$dbname = "recipe_manager"; // The name of the database.

// Create a new MySQLi connection.
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors.
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error.
    // Provide a JSON error message for the frontend to handle.
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit(); // Stop script execution if connection fails.
}

// Read the raw POST data from the request body.
$rawData = file_get_contents("php://input");
// Decode the JSON string into a PHP associative array.
$data = json_decode($rawData, true);

// Validate incoming data to ensure all required fields are present.
if (
    !$data || // Check if $data is null or empty.
    !isset($data["title"]) || empty(trim($data["title"])) || // Title must exist and not be empty.
    !isset($data["instructions"]) || empty(trim($data["instructions"])) || // Instructions must exist and not be empty.
    !isset($data["ingredients"]) || !is_array($data["ingredients"]) // Ingredients must exist and be an array.
    // Add checks for image_url, prep_time, cook_time if they are mandatory
) {
    http_response_code(400); // Bad Request.
    echo json_encode(["error" => "Missing or invalid recipe data. Title, instructions, and ingredients array are required."]);
    exit();
}

// Extract data for the recipes table.
$title = trim($data["title"]);
$instructions = trim($data["instructions"]);
$imageUrl = isset($data["image_url"]) ? trim($data["image_url"]) : null; 
$prepTime = isset($data["prep_time"]) ? trim($data["prep_time"]) : null; 
$cookTime = isset($data["cook_time"]) ? trim($data["cook_time"]) : null; 

// Prepare an SQL statement for inserting into the recipes table.
// Added image_url, prep_time, cook_time fields to the insert statement.
$stmt = $conn->prepare("INSERT INTO recipes (title, instructions, image_url, prep_time, cook_time) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $title, $instructions, $imageUrl, $prepTime, $cookTime);

// Execute the prepared statement.
if (!$stmt->execute()) {
    http_response_code(500); // Internal Server Error.
    echo json_encode(["error" => "Failed to insert recipe: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}

// Get the ID of the newly inserted recipe.
// This ID will be used as a foreign key for the ingredients.
$recipe_id = $conn->insert_id;
$stmt->close(); // Close the statement for the recipe insertion.

// Process and insert ingredients.
$ingredients = $data["ingredients"];
if (!empty($ingredients)) {
    // Prepare a single statement for inserting ingredients to be reused in the loop for efficiency.
    $stmt_ing = $conn->prepare("INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)");

    foreach ($ingredients as $ingredient) {
        // Validate each ingredient's fields.
        //Skipping invalid ingredients silently might not always be the best approach.
        if (
            !isset($ingredient["name"]) || empty(trim($ingredient["name"])) ||
            !isset($ingredient["quantity"]) || // Quantity can be 0 so just check if set.
            !isset($ingredient["unit"]) // Unit can be an empty string if not applicable so just check if set.
        ) {
            // Log skipped ingredient 
            // error_log("Skipping invalid ingredient for recipe_id {$recipe_id}: " . json_encode($ingredient));
            continue; // Skip this ingredient and proceed to the next one.
        }

        $name = trim($ingredient["name"]);
        // Ensure quantity is treated as a string for binding
        // Using floatval and then binding as string is safer if DB field is numeric but input can vary.
        $quantity = strval($ingredient["quantity"]); 
        $unit = trim($ingredient["unit"]);

        // Bind parameters for the ingredient insertion.
        // `d` for double if quantity is numeric and `s` for string.
        // Assuming quantity is stored as varchar or text or a numeric type that accepts string representation
        $stmt_ing->bind_param("isss", $recipe_id, $name, $quantity, $unit);
        
        if (!$stmt_ing->execute()) {
            // Log error for specific ingredient insertion 
            // error_log("Failed to insert ingredient for recipe_id {$recipe_id}: " . $stmt_ing->error);

        }
    }
    $stmt_ing->close(); // Close the ingredient statement after the loop.
}

// Send a success response back to the frontend.
http_response_code(200); // OK.
echo json_encode(["success" => true, "message" => "Recipe and ingredients saved successfully.", "recipe_id" => $recipe_id]);

// Close the database connection.
$conn->close();
?>
