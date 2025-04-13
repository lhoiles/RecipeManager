//Create get_recipes.php
//This file will retrieve all recipes from your database and send them to the frontend as JSON.


<?php
// Allow requests from any domain (important for frontend-backend communication)
header("Access-Control-Allow-Origin: *");

// Set the response content type to JSON
header("Content-Type: application/json");

// Connect to the MySQL database using MySQLi
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Check if the connection failed
if ($conn->connect_error) {
    // If connection failed, stop the script and return an error message as JSON
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// SQL query to select all rows from the 'recipes' table
$sql = "SELECT * FROM recipes";

// Run the query and store the result
$result = $conn->query($sql);

// Create an empty array to store the recipe data
$recipes = [];

// If the query returned one or more rows
if ($result->num_rows > 0) {
    // Loop through each row in the result
    while ($row = $result->fetch_assoc()) {
        // Add each row (recipe) to the recipes array
        $recipes[] = $row;
    }
}

// Convert the recipes array into JSON and send it to the client (frontend)
echo json_encode($recipes);

// Close the database connection
$conn->close();
?>

//This PHP file does the following:
//Connects to recipe_manager database
//Runs a query to get all rows from the recipes table
//Sends the result as a JSON list (which React will later read)
