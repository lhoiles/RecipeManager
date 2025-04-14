// Importing React and useEffect/useState hooks to manage state and side effects
import React, { useEffect, useState } from "react";

// Import Axios to make HTTP requests to your PHP backend
import axios from "axios";

function App() {
  // State to hold the array of recipes fetched from the backend
  const [recipes, setRecipes] = useState([]);

  // useEffect runs once when the component loads (like componentDidMount)
  useEffect(() => {
    // Make a GET request to your PHP backend API to fetch recipes
    axios
      .get("http://localhost/recipe-api/get_recipes.php")
      .then((response) => {
        // If successful, store the fetched recipes in state
        setRecipes(response.data);
      })
      .catch((error) => {
        // If there’s an error (like WAMP not running), log it
        console.error("Error fetching recipes:", error);
      });
  }, []); // Empty dependency array = run only once on first load

  return (
    <div
      style={{
        padding: "2rem",              // Add space around the content
        maxWidth: "600px",            // Set max width for centered layout
        margin: "auto",               // Center horizontally
      }}
    >
      <h1>📖 Recipe Manager</h1>

      {/* If no recipes exist, show a message */}
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        // Otherwise, loop through each recipe and show it in a styled box
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              style={{
                border: "1px solid #ccc",      // Light border
                padding: "1rem",               // Internal spacing
                marginBottom: "1rem",          // Space between recipes
                borderRadius: "8px",           // Rounded corners
              }}
            >
              <h3>{recipe.title}</h3>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p>
                <strong>Instructions:</strong> {recipe.instructions}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Export this component as the default one to use in index.js
export default App;
