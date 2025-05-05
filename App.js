// Import necessary hooks from react
import React, { useEffect, useState } from "react";

// Import routing tools from react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Axios to make HTTP requests to the backend
import axios from "axios";

// Import your custom components
import AddRecipeForm from "./AddRecipeForm";
import RecipeList from "./RecipeList";
import RecipeDetails from "./RecipeDetails"; // This will be the page for a single recipe view

function App() {
  // This state holds all recipes fetched from the backend
  const [recipes, setRecipes] = useState([]);

  // Run fetchRecipes() when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  // This function fetches all recipes from the backend API
  const fetchRecipes = () => {
    axios
      .get("http://localhost/recipe-api/get_recipes.php") // Call PHP endpoint
      .then((response) => {
        setRecipes(response.data); // Save the list of recipes to state
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  };

  return (
    // Router wraps the entire app and enables navigation between pages
    <Router>
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
        {/* Application heading */}
        <h1>Recipe Manager</h1>

        {/* Define all routes in the application */}
        <Routes>
          {/* Home route: shows the add form and recipe list */}
          <Route
            path="/"
            element={
              <>
                <AddRecipeForm onRecipeAdded={fetchRecipes} />
                <RecipeList recipes={recipes} onUpdate={fetchRecipes} />
              </>
            }
          />

          {/* Dynamic route for viewing an individual recipe by its ID */}
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

// Export the App component so it can be rendered in index.js
export default App;
