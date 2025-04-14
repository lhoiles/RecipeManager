//Create add_recipe.php
//This file will send new recipes (title, ingredients, instructions) from frontend into the database

<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Connect to MySQL
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Check the DB connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the POST data as JSON
$data = json_decode(file_get_contents("php://input"), true);

// Extract recipe info
$title = $data["title"];
$instructions = $data["instructions"];
$ingredients = $data["ingredients"]; // This should be an array of ingredients

// Insert the recipe (title + instructions) first
$sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, '', ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $title, $instructions);

if ($stmt->execute()) {
    // Get the ID of the recipe we just inserted
    $recipe_id = $conn->insert_id;

    // Now insert each ingredient into the ingredients table
    $inserted_all = true;

    foreach ($ingredients as $ingredient) {
        $name = $ingredient["name"];
        $quantity = $ingredient["quantity"];
        $unit = $ingredient["unit"];

        $sql_ingredient = "INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)";
        $stmt_ingredient = $conn->prepare($sql_ingredient);
        $stmt_ingredient->bind_param("isds", $recipe_id, $name, $quantity, $unit);

        if (!$stmt_ingredient->execute()) {
            $inserted_all = false;
            break;
        }
    }

    if ($inserted_all) {
        echo json_encode(["message" => "Recipe and ingredients added successfully"]);
    } else {
        echo json_encode(["error" => "Recipe added but failed to insert some ingredients"]);
    }

} else {
    echo json_encode(["error" => "Failed to add recipe"]);
}

$stmt->close();
$conn->close();
?>
