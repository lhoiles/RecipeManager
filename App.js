// Importing React and useEffect/useState hooks
import React, { useEffect, useState } from "react";

// Axios for HTTP requests
import axios from "axios";

// Import the modular components
import AddRecipeForm from "./AddRecipeForm";
import RecipeList from "./RecipeList";

function App() {
  // State to hold all recipes
  const [recipes, setRecipes] = useState([]);

  // Load recipes on page load
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Function to fetch recipes from backend
  const fetchRecipes = () => {
    axios
      .get("http://localhost/recipe-api/get_recipes.php")
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  };

  return (
    <div
      style={{
        padding: "2rem",       // Outer padding
        maxWidth: "600px",     // Limit width for layout
        margin: "auto",        // Center the container
      }}
    >
      <h1>Recipe Manager</h1>

      {/* Add recipe form component */}
      <AddRecipeForm onRecipeAdded={fetchRecipes} />

      {/* Recipe list component */}
      <RecipeList recipes={recipes} onUpdate={fetchRecipes} />
    </div>
  );
}

// Export the main App component
export default App;
