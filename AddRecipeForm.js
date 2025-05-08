import React, { useState } from "react";
import axios from "axios";

function AddRecipeForm({ onRecipeAdded }) {
    const [title, setTitle] = useState(""); // Recipe title
    const [instructions, setInstructions] = useState(""); // Cooking instructions

    // Ingredients: array of { name, quantity, unit }
    const [ingredients, setIngredients] = useState([
        { name: "", quantity: "", unit: "" }
    ]);

    // Handle ingredient changes
    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    // Add ingredient input row
    const addIngredientField = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    // Remove an ingredient row
    const removeIngredientField = (index) => {
        const updated = ingredients.filter((_, i) => i !== index);
        setIngredients(updated);
    };

    // Submit recipe to backend AND localStorage
    const handleAddRecipe = (e) => {
        e.preventDefault();

        const newRecipe = {
            title,
            instructions,
            ingredients: ingredients.filter(
                (i) => i.name && i.quantity && i.unit
            )
        };

        // Send to PHP backend
        axios
            .post("http://localhost/recipe-api/add_recipe.php", newRecipe)
            .then((response) => {
                console.log("Recipe added:", response.data);

                // Save to localStorage too
                const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

                const createdRecipe = {
                    id: response.data.recipe_id || Date.now(), // use backend ID or fallback
                    ...newRecipe,
                    isFavourite: false
                };

                localStorage.setItem(
                    "savedRecipes",
                    JSON.stringify([...saved, createdRecipe])
                );

                // Clear form
                setTitle("");
                setInstructions("");
                setIngredients([{ name: "", quantity: "", unit: "" }]);

                if (onRecipeAdded) onRecipeAdded();
            })
            .catch((error) => {
                console.error("Error adding recipe:", error);
            });
    };

    return (
        <form onSubmit={handleAddRecipe} style={{ marginBottom: "2rem" }}>
            <h2>Add New Recipe</h2>

            <input
                type="text"
                placeholder="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            />

            <textarea
                placeholder="Instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            />

            <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                        alignItems: "center"
                    }}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={ingredient.name}
                        onChange={(e) =>
                            handleIngredientChange(index, "name", e.target.value)
                        }
                        required
                        style={{ flex: 2 }}
                    />
                    <input
                        type="number"
                        placeholder="Qty"
                        value={ingredient.quantity}
                        step="0.01"
                        onChange={(e) =>
                            handleIngredientChange(index, "quantity", e.target.value)
                        }
                        required
                        style={{ flex: 1 }}
                    />
                    <select
                        value={ingredient.unit}
                        onChange={(e) =>
                            handleIngredientChange(index, "unit", e.target.value)
                        }
                        required
                        style={{ flex: 1 }}
                    >
                        <option value="">Unit</option>
                        <option value="cups">cups</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="oz">oz</option>
                        <option value="lb">lb</option>
                        <option value="pcs">pcs</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => removeIngredientField(index)}
                        style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        x
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addIngredientField}
                style={{ marginBottom: "1rem" }}
            >
                + Add Ingredient
            </button>

            <br />

            <button
                type="submit"
                style={{
                    padding: "0.5rem 1rem",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                Add Recipe
            </button>
        </form>
    );
}

export default AddRecipeForm;
