<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "recipe_manager");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$recipes_sql = "SELECT id, title, instructions FROM recipes";
$recipes_result = $conn->query($recipes_sql);

$recipes = [];

while ($recipe = $recipes_result->fetch_assoc()) {
    $recipe_id = $recipe["id"];

    // Fetch ingredients for this recipe
    $ingredients_sql = "SELECT name, quantity, unit FROM ingredients WHERE recipe_id = $recipe_id";
    $ingredients_result = $conn->query($ingredients_sql);

    $ingredient_list = [];
    while ($ing = $ingredients_result->fetch_assoc()) {
        $ingredient_list[] = $ing["quantity"] . " " . $ing["unit"] . " " . $ing["name"];
    }

    // Join all ingredients into one display string
    $recipe["ingredients"] = implode(", ", $ingredient_list);

    $recipes[] = $recipe;
}

echo json_encode($recipes);
$conn->close();
?>


// Convert the recipes array into JSON and send it to the client (frontend)
echo json_encode($recipes);

// Close the database connection
$conn->close();
?>

//This PHP file does the following:
//Connects to recipe_manager database
//Runs a query to get all rows from the recipes table
//Sends the result as a JSON list (which React will later read)
