<?php
// get_ingredients.php
// This script fetches all ingredients for a specific recipe ID.
// The recipe_id is expected as a GET query parameter.

// Set CORS headers - important for allowing frontend access.
// Should be consistent with other API files. 
header("Access-Control-Allow-Origin: http://localhost:3000"); // Or your specific frontend domain
header("Access-Control-Allow-Methods: GET, OPTIONS"); // This endpoint primarily uses GET.
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set the content type of the response to JSON.
header("Content-Type: application/json");

// Enable error reporting for debugging during development.
// Student Note: Turn this off or log to file in a production environment.
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Database connection details.
// For a larger application, these would typically be in a configuration file.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recipe_manager";

// Establish a new database connection using MySQLi.
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the database connection was successful.
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error.
    // Output a JSON error message and terminate the script.
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get the recipe_id from the GET request query parameters.
// Ensure recipe_id is set and cast it to an integer.
if (!isset($_GET["recipe_id"]) || empty($_GET["recipe_id"])) {
    http_response_code(400); // Bad Request.
    echo json_encode(["error" => "Recipe ID is required."]);
    exit();
}
$recipe_id = intval($_GET["recipe_id"]);

if ($recipe_id <= 0) {
    http_response_code(400); // Bad Request.
    echo json_encode(["error" => "Invalid Recipe ID provided."]);
    exit();
}

// Prepare the SQL statement to select ingredients for the given recipe_id.
// Using a prepared statement helps prevent SQL injection.
$sql = "SELECT id, name, quantity, unit FROM ingredients WHERE recipe_id = ?"; // Also selecting ingredient ID
$stmt = $conn->prepare($sql);

// Bind the integer recipe_id parameter to the prepared statement.
$stmt->bind_param("i", $recipe_id); // "i" for integer type.

// Execute the prepared statement.
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to retrieve ingredients: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}

// Get the result set from the executed statement.
$result = $stmt->get_result();

// Initialize an empty array to store the ingredients.
$ingredients = [];

// Fetch each row from the result set as an associative array.
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Student Note: Ensure numeric types like quantity are correctly formatted if necessary.
        // Here they are fetched as strings if the DB stores them that way or as their native types.
        // If quantity is stored as a numeric type in DB it will be fetched as such.
        $ingredients[] = $row;
    }
}

// Close the prepared statement.
$stmt->close();
// Close the database connection.
$conn->close();

// Encode the ingredients array into JSON and output it.
// If no ingredients are found, an empty array will be returned
http_response_code(200); // OK.
echo json_encode($ingredients);
?>
