<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Query all recipes
$recipes_sql = "SELECT id, title, instructions FROM recipes";
$recipes_result = $conn->query($recipes_sql);

$recipes = [];

while ($recipe = $recipes_result->fetch_assoc()) {
    $recipe_id = $recipe["id"];

    // Get all ingredients linked to this recipe
    $ingredients_sql = "SELECT name, quantity, unit FROM ingredients WHERE recipe_id = $recipe_id";
    $ingredients_result = $conn->query($ingredients_sql);

    $ingredient_list = [];

    while ($ing = $ingredients_result->fetch_assoc()) {
        $ingredient_list[] = $ing["quantity"] . " " . $ing["unit"] . " " . $ing["name"];
    }

    // Join ingredients into a single readable string
    $recipe["ingredients"] = implode(", ", $ingredient_list);

    $recipes[] = $recipe;
}

// Return all recipes with their ingredients
echo json_encode($recipes);
$conn->close();
?>


//This PHP file does the following:
//Connects to recipe_manager database
//Runs a query to get all rows from the recipes table
//Sends the result as a JSON list (which React will later read)
