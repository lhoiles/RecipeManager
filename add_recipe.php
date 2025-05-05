//Create add_recipe.php
//This file will send new recipes (title, ingredients, instructions) from frontend into the database

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Connect to the MySQL database
$conn = new mysqli("localhost", "root", "", "recipe_manager");

// Handle connection errors
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON input from the React frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validate incoming data
if (!$data || !isset($data["title"]) || !isset($data["instructions"])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$title = $data["title"];
$instructions = $data["instructions"];
$ingredients = $data["ingredients"];

// Insert recipe into recipes table
$sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, '', ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $title, $instructions);

if ($stmt->execute()) {
    $recipe_id = $conn->insert_id;
    $success = true;

    // Insert ingredients into ingredients table
    foreach ($ingredients as $ingredient) {
        $name = $ingredient["name"];
        $quantity = $ingredient["quantity"];
        $unit = $ingredient["unit"];

        $sql_ing = "INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)";
        $stmt_ing = $conn->prepare($sql_ing);
        $stmt_ing->bind_param("isds", $recipe_id, $name, $quantity, $unit);

        if (!$stmt_ing->execute()) {
            $success = false;
            break;
        }
    }

    if ($success) {
        echo json_encode(["success" => true, "message" => "Recipe and ingredients added successfully"]);
    } else {
        echo json_encode(["error" => "Recipe saved, but some ingredients failed to save"]);
    }
} else {
    echo json_encode(["error" => "Failed to add recipe"]);
}

$stmt->close();
$conn->close();
?>
