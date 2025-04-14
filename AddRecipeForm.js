// Import React and useState hook to manage form input values
import React, { useState } from "react";

// Import Axios to send HTTP requests to the backend
import axios from "axios";

// Define the AddRecipeForm component
// 'onRecipeAdded' is a function passed from App.js to refresh the recipe list after adding a new one
function AddRecipeForm({ onRecipeAdded }) {
  // useState hooks to manage form field values
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  // Function that runs when the form is submitted
  const handleAddRecipe = (e) => {
    e.preventDefault(); // Prevents page reload

    // Create a new recipe object using the input values
    const newRecipe = {
      title,
      ingredients,
      instructions,
    };

    // Send the recipe to the backend using a POST request
    axios
      .post("http://localhost/recipe-api/add_recipe.php", newRecipe)
      .then((response) => {
        console.log("Recipe added:", response.data);

        // Clear the form inputs after successful submission
        setTitle("");
        setIngredients("");
        setInstructions("");

        // Call the callback function from App.js to refresh the recipe list
        if (onRecipeAdded) onRecipeAdded();
      })
      .catch((error) => {
        // Log any errors that happen during the request
        console.error("Error adding recipe:", error);
      });
  };

  return (
    // Form to input new recipe data
    <form onSubmit={handleAddRecipe} style={{ marginBottom: "2rem" }}>
      <h2>Add New Recipe</h2>

      {/* Input for the recipe title */}
      <input
        type="text"
        placeholder="Title"
        value={title} // Controlled input: React manages the value
        onChange={(e) => setTitle(e.target.value)} // Update state on input change
        required
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />

      {/* Textarea for ingredients */}
      <textarea
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />

      {/* Textarea for instructions */}
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        required
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />

      {/* Submit button */}
      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Add Recipe
      </button>
    </form>
  );
}

// Export the component so App.js can use it
export default AddRecipeForm;
