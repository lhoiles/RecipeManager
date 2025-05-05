<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "recipe_manager");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$recipe_id = $_GET["recipe_id"];

$sql = "SELECT name, quantity, unit FROM ingredients WHERE recipe_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $recipe_id);
$stmt->execute();

$result = $stmt->get_result();
$ingredients = [];

while ($row = $result->fetch_assoc()) {
    $ingredients[] = $row;
}

echo json_encode($ingredients);
$stmt->close();
$conn->close();
?>
