// Import React and useState hook for managing local component state
import React, { useState } from "react";

// Import Axios for communicating with the backend
import axios from "axios";

//adding import
import { Link } from "react-router-dom";


// This component displays a single recipe, and allows editing or deleting it
function RecipeCard({ recipe, onUpdate }) {
    // State to track if we're editing this recipe
    const [isEditing, setIsEditing] = useState(false);

    // State to store edited values during edit mode
    const [title, setTitle] = useState(recipe.title);
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [instructions, setInstructions] = useState(recipe.instructions);

    // Function to delete the recipe
    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        axios
            .delete("http://localhost/recipe-api/delete_recipe.php", {
                data: { id: recipe.id }, // Send the ID of the recipe to delete
            })
            .then((res) => {
                console.log("Deleted:", res.data);
                onUpdate(); // Refresh recipe list after deletion
            })
            .catch((err) => {
                console.error("Delete error:", err);
            });
    };

    // Function to update the recipe
    const handleUpdate = (e) => {
        e.preventDefault();

        axios
            .put("http://localhost/recipe-api/update_recipe.php", {
                id: recipe.id,
                title,
                ingredients,
                instructions,
            })
            .then((res) => {
                console.log("Updated:", res.data);
                setIsEditing(false); // Exit edit mode
                onUpdate(); // Refresh recipe list
            })
            .catch((err) => {
                console.error("Update error:", err);
            });
    };

    return (
        <li
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
            }}
        >
            {isEditing ? (
                // If editing, show the form inputs
                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <button type="submit" style={{ marginRight: "1rem" }}>
                        Save
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                // Otherwise, display the recipe content
                <>
                    <h3>
                       <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: "none", color: "#007bff" }}>
                        {recipe.title}
                       </Link>
                    </h3>

                    <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    <button onClick={() => setIsEditing(true)} style={{ marginRight: "1rem" }}>
                        Edit
                    </button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </li>
    );
}

// Export the component so it can be used in RecipeList
export default RecipeCard;
