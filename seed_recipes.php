<?php
// seed_recipes.php
// This script is used to populate the database with initial sample recipe data.
// It's helpful for development and testing to have a pre-filled database.
// Student Note: This script should ideally be run manually or via a specific command,
// and not be publicly accessible in a production environment.

// Allow script to be run from browser or command line (for development convenience)
if (php_sapi_name() !== 'cli') {
    // Set CORS headers if run via browser (e.g., for testing endpoint directly)
    header("Access-Control-Allow-Origin: http://localhost:3000"); // Or your frontend URL
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    header("Content-Type: application/json");
}

// Enable error reporting for detailed feedback during seeding.
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Database connection details.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recipe_manager";

// Establish database connection.
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors.
if ($conn->connect_error) {
    $error_message = "Database connection failed: " . $conn->connect_error;
    if (php_sapi_name() !== 'cli') {
        http_response_code(500);
        echo json_encode(["error" => $error_message]);
    } else {
        echo $error_message . "\n";
    }
    exit();
}

// Helper function to create a unique seed for Picsum photos from the recipe title.
// This helps in getting somewhat consistent placeholder images.
function create_image_seed_from_title($title) {
    // Remove non-alphanumeric characters to create a simple seed string.
    return preg_replace('/[^a-zA-Z0-9]/', '', $title);
}

// Array of dummy recipes to seed the database.
// Student Note: Each recipe includes title, instructions, a dynamically generated image_url,
// and an array of ingredients, each with name, quantity, and unit.
// Added prep_time and cook_time fields.
$dummyRecipes = [
    [
        "title" => "Classic Spaghetti Carbonara",
        "instructions" => "Cook spaghetti according to package directions. While spaghetti cooks, fry pancetta in a large skillet over medium heat until crispy. In a bowl, whisk together eggs, grated Parmesan cheese, and a pinch of black pepper. Drain spaghetti, reserving some pasta water. Add spaghetti to the skillet with pancetta. Remove from heat. Quickly stir in egg mixture, adding a little reserved pasta water if needed to create a creamy sauce. Serve immediately.",
        "image_url" => "https://picsum.photos/seed/" . create_image_seed_from_title("Classic Spaghetti Carbonara") . "/600/400",
        "prep_time" => "10 mins",
        "cook_time" => "15 mins",
        "ingredients" => [
            ["name" => "Spaghetti", "quantity" => "200", "unit" => "g"],
            ["name" => "Pancetta or Guanciale", "quantity" => "100", "unit" => "g"],
            ["name" => "Large Eggs", "quantity" => "2", "unit" => "pcs"],
            ["name" => "Parmesan Cheese, grated", "quantity" => "50", "unit" => "g"],
            ["name" => "Black Pepper", "quantity" => "To taste", "unit" => ""],
        ],
    ],
    [
        "title" => "Simple Tomato Soup",
        "instructions" => "Heat olive oil in a pot. Sauté chopped onions and garlic until softened. Add canned diced tomatoes, vegetable broth, and a pinch of sugar. Season with salt and pepper. Bring to a simmer and cook for 15-20 minutes. Use an immersion blender to blend the soup until smooth, or carefully transfer to a regular blender.",
        "image_url" => "https://picsum.photos/seed/" . create_image_seed_from_title("Simple Tomato Soup") . "/600/400",
        "prep_time" => "5 mins",
        "cook_time" => "25 mins",
        "ingredients" => [
            ["name" => "Canned Diced Tomatoes", "quantity" => "800", "unit" => "g"],
            ["name" => "Onion, chopped", "quantity" => "1", "unit" => "medium"],
            ["name" => "Garlic, minced", "quantity" => "2", "unit" => "cloves"],
            ["name" => "Vegetable Broth", "quantity" => "500", "unit" => "ml"],
            ["name" => "Olive Oil", "quantity" => "1", "unit" => "tbsp"],
        ],
    ],
    // ... (Add more diverse and detailed recipes here, including prep_time and cook_time for all)
    [
        "title" => "Chicken Stir-Fry",
        "instructions" => "Cut chicken breast into bite-sized pieces. Chop vegetables like broccoli, bell peppers, and carrots. Heat oil in a wok or large skillet. Add chicken and stir-fry until browned. Add vegetables and stir-fry until tender-crisp. In a small bowl, mix soy sauce, a little honey, ginger, and garlic. Pour sauce over chicken and vegetables. Cook for another minute until sauce thickens. Serve with rice or noodles.",
        "image_url" => "https://picsum.photos/seed/" . create_image_seed_from_title("Chicken Stir-Fry") . "/600/400",
        "prep_time" => "20 mins",
        "cook_time" => "15 mins",
        "ingredients" => [
            ["name" => "Chicken Breast, sliced", "quantity" => "250", "unit" => "g"],
            ["name" => "Broccoli florets", "quantity" => "150", "unit" => "g"],
            ["name" => "Bell Pepper, sliced", "quantity" => "1", "unit" => "medium"],
            ["name" => "Soy Sauce", "quantity" => "3", "unit" => "tbsp"],
            ["name" => "Sesame Oil", "quantity" => "1", "unit" => "tsp"],
        ],
    ],
     [
        "title" => "Classic Cheeseburger",
        "instructions" => "Form ground beef into patties, season with salt and pepper. Grill or pan-fry patties to desired doneness. During the last minute of cooking, place a cheese slice on each patty to melt. Lightly toast burger buns. Assemble burgers with lettuce, tomato, onion, and your favorite condiments.",
        "image_url" => "https://picsum.photos/seed/" . create_image_seed_from_title("Classic Cheeseburger") . "/600/400",
        "prep_time" => "10 mins",
        "cook_time" => "10 mins",
        "ingredients" => [
          ["name" => "Ground Beef (80/20)", "quantity" => "150", "unit" => "g"],
          ["name" => "Burger Bun", "quantity" => "1", "unit" => "pc"],
          ["name" => "Cheddar Cheese Slice", "quantity" => "1", "unit" => "slice"],
          ["name" => "Lettuce Leaf", "quantity" => "1", "unit" => "leaf"],
          ["name" => "Tomato Slice", "quantity" => "1-2", "unit" => "slices"],
        ],
    ],
    [
        "title" => "Greek Salad",
        "instructions" => "Chop cucumbers, tomatoes, and red onion. Combine in a bowl with Kalamata olives and feta cheese. For the dressing, whisk together olive oil, red wine vinegar, dried oregano, salt, and pepper. Pour dressing over the salad and toss gently.",
        "image_url" => "https://picsum.photos/seed/" . create_image_seed_from_title("Greek Salad") . "/600/400",
        "prep_time" => "15 mins",
        "cook_time" => "0 mins",
        "ingredients" => [
          ["name" => "Cucumber, chopped", "quantity" => "1", "unit" => "large"],
          ["name" => "Tomatoes, chopped", "quantity" => "2-3", "unit" => "medium"],
          ["name" => "Kalamata Olives, halved", "quantity" => "100", "unit" => "g"],
          ["name" => "Feta Cheese, crumbled", "quantity" => "150", "unit" => "g"],
          ["name" => "Red Onion, thinly sliced", "quantity" => "0.5", "unit" => "small"],
          ["name" => "Olive Oil", "quantity" => "3", "unit" => "tbsp"],
          ["name" => "Red Wine Vinegar", "quantity" => "1", "unit" => "tbsp"],
          ["name" => "Dried Oregano", "quantity" => "1", "unit" => "tsp"],
        ],
    ]
    // Add about 15-20 diverse recipes in total for a good initial set.
];

$insertedCount = 0;
$skippedCount = 0;
$errorCount = 0;

// Loop through each dummy recipe and insert it into the database.
foreach ($dummyRecipes as $recipeData) {
    // Extract recipe details.
    $title = $recipeData["title"];
    $instructions = $recipeData["instructions"];
    $image_url = $recipeData["image_url"];
    $prep_time = isset($recipeData["prep_time"]) ? $recipeData["prep_time"] : null;
    $cook_time = isset($recipeData["cook_time"]) ? $recipeData["cook_time"] : null;
    $ingredientsArray = $recipeData["ingredients"];

    // Student Note: Check if a recipe with the same title already exists to avoid duplicates during re-runs.
    $checkStmt = $conn->prepare("SELECT id FROM recipes WHERE title = ?");
    $checkStmt->bind_param("s", $title);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows > 0) {
        if (php_sapi_name() === 'cli') { echo "Skipping existing recipe: $title\n"; }
        $skippedCount++;
        $checkStmt->close();
        continue; // Skip to the next recipe.
    }
    $checkStmt->close();

    // Begin transaction for atomicity: either recipe and all its ingredients are added, or nothing is.
    $conn->begin_transaction();

    // Prepare SQL statement for inserting the recipe.
    $stmt_recipe = $conn->prepare("INSERT INTO recipes (title, instructions, image_url, prep_time, cook_time) VALUES (?, ?, ?, ?, ?)");
    $stmt_recipe->bind_param("sssss", $title, $instructions, $image_url, $prep_time, $cook_time);

    if ($stmt_recipe->execute()) {
        $recipe_id = $conn->insert_id; // Get the ID of the inserted recipe.
        $stmt_recipe->close();

        // Prepare statement for inserting ingredients.
        $stmt_ingredients = $conn->prepare("INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?, ?, ?, ?)");
        $allIngredientsInserted = true;

        foreach ($ingredientsArray as $ingredient) {
            $name = $ingredient["name"];
            $quantity = strval($ingredient["quantity"]); // Ensure quantity is string for DB
            $unit = $ingredient["unit"];
            $stmt_ingredients->bind_param("isss", $recipe_id, $name, $quantity, $unit);
            if (!$stmt_ingredients->execute()) {
                $allIngredientsInserted = false;
                // error_log("Failed to insert ingredient for recipe '$title': " . $stmt_ingredients->error); // Log specific error
                break; // Stop inserting ingredients for this recipe if one fails.
            }
        }
        $stmt_ingredients->close();

        if ($allIngredientsInserted) {
            $conn->commit(); // All good, commit the transaction.
            $insertedCount++;
        } else {
            $conn->rollback(); // Something went wrong with ingredients, roll back.
            // error_log("Rolled back recipe insertion for '$title' due to ingredient insertion failure.");
            $errorCount++;
        }
    } else {
        // error_log("Failed to insert recipe '$title': " . $stmt_recipe->error);
        $conn->rollback(); // Ensure rollback if recipe insertion itself failed.
        $errorCount++;
        if ($stmt_recipe) $stmt_recipe->close();
    }
}

// Close the database connection.
$conn->close();

// Output a summary of the seeding process.
$message = "Recipe seeding process completed. Recipes Inserted: $insertedCount, Skipped (already exist): $skippedCount, Errors: $errorCount.";
if (php_sapi_name() !== 'cli') {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => $message]);
} else {
    echo $message . "\n";
}
?> 