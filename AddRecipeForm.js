import React, { useState } from "react";
import axios from "axios";

/**
 * AddRecipeForm Component
 * 
 * This component provides a form to add new recipes to both the backend API
 * and local storage. It demonstrates state management in React, form handling,
 * and API integration.
 * 
 * I created this component to allow users to contribute
 * their own recipes to the recipe management system.
 */
function AddRecipeForm({ onRecipeAdded }) {
    // State variables to manage form input values
    const [title, setTitle] = useState(""); // Recipe title
    const [imageUrl, setImageUrl] = useState(""); // Optional image URL
    const [prepTime, setPrepTime] = useState(""); // Preparation time
    const [cookTime, setCookTime] = useState(""); // Cooking time
    const [instructions, setInstructions] = useState(""); // Cooking instructions
    const [submitting, setSubmitting] = useState(false); // Track form submission status

    // Dynamic ingredients list - each ingredient has name, quantity, and unit
    // Using an array of objects to store multiple ingredients
    const [ingredients, setIngredients] = useState([
        { name: "", quantity: "", unit: "" }
    ]);

    /**
     * Updates a specific field of an ingredient at the given index
     * 
     * @param {number} index - The index of the ingredient to update
     * @param {string} field - The field to update (name, quantity, or unit)
     * @param {string} value - The new value for the field
     */
    const handleIngredientChange = (index, field, value) => {
        // Create a copy of the ingredients array to maintain immutability
        const updated = [...ingredients];
        // Update the specific field for the ingredient at the given index
        updated[index][field] = value;
        // Set the updated array as the new state
        setIngredients(updated);
    };

    /**
     * Adds a new empty ingredient field to the ingredients list
     */
    const addIngredientField = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    /**
     * Removes an ingredient field at the specified index
     * 
     * @param {number} index - The index of the ingredient to remove
     */
    const removeIngredientField = (index) => {
        // Filter out the ingredient at the specified index
        const updated = ingredients.filter((_, i) => i !== index);
        setIngredients(updated);
    };

    /**
     * Handles form submission to save the recipe
     * 
     * @param {Event} e - The form submission event
     */
    const handleAddRecipe = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setSubmitting(true); // Set submitting state to show loading indicator

        // Create recipe object from form data
        const newRecipe = {
            title,
            instructions,
            image_url: imageUrl,
            prep_time: prepTime,
            cook_time: cookTime,
            // Filter out incomplete ingredients
            ingredients: ingredients.filter(
                (i) => i.name && i.quantity && i.unit
            )
        };

        // Send recipe data to the PHP backend API
        axios
            .post("http://localhost/recipe-api/add_recipe.php", newRecipe)
            .then((response) => {
                console.log("Recipe added:", response.data);

                // Also save to browser's localStorage for offline access
                const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

                // Create a complete recipe object with additional metadata
                const createdRecipe = {
                    // Use the server-generated ID or create a timestamp-based ID as fallback
                    id: response.data.recipe_id || Date.now().toString(),
                    ...newRecipe,
                    isUserCreated: true, // Flag to identify user-created recipes
                    isFavourite: false   // Initial favorite status
                };

                // Save the updated recipes array to localStorage
                localStorage.setItem(
                    "savedRecipes",
                    JSON.stringify([...saved, createdRecipe])
                );

                // Reset form fields after successful submission
                setTitle("");
                setImageUrl("");
                setPrepTime("");
                setCookTime("");
                setInstructions("");
                setIngredients([{ name: "", quantity: "", unit: "" }]);

                // Call the callback function if provided
                if (onRecipeAdded) onRecipeAdded();
            })
            .catch((error) => {
                console.error("Error adding recipe:", error);
                // In a production app, I would add user-friendly error handling here
                alert("There was an error saving your recipe. Please try again.");
            })
            .finally(() => {
                setSubmitting(false); // Reset submission state
            });
    };

    // Render the form with styled components
    return (
        <form onSubmit={handleAddRecipe}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>Add New Recipe</h3>

            {/* Recipe Title Field */}
            <div style={{ marginBottom: "var(--spacing-md)" }}>
                <label htmlFor="recipeTitle" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Recipe Title</label>
                <input
                    id="recipeTitle"
                    type="text"
                    placeholder="Recipe Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            {/* Image URL Field */}
            <div style={{ marginBottom: "var(--spacing-md)" }}>
                <label htmlFor="imageUrl" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Image URL</label>
                <input
                    id="imageUrl"
                    type="url"
                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            {/* Prep & Cook Time Fields - Side by side using flex layout */}
            <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="prepTime" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Prep Time</label>
                    <input
                        id="prepTime"
                        type="text"
                        placeholder="e.g., 20 mins"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="cookTime" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Cook Time</label>
                    <input
                        id="cookTime"
                        type="text"
                        placeholder="e.g., 1 hour"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                    />
                </div>
            </div>

            {/* Instructions Field */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label htmlFor="instructions" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Instructions</label>
                <textarea
                    id="instructions"
                    placeholder="Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                />
            </div>

            {/* Ingredients Section - Dynamic list with add/remove functionality */}
            <div style={{ marginBottom: "var(--spacing-md)" }}>
                <h4 style={{ marginBottom: "var(--spacing-sm)" }}>Ingredients</h4>
                
                <div style={{ 
                    backgroundColor: "var(--neutral-bg)", 
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "var(--spacing-md)"
                }}>
                    {ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr auto",
                                gap: "var(--spacing-sm)",
                                marginBottom: "var(--spacing-sm)",
                                alignItems: "center"
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Ingredient Name"
                                value={ingredient.name}
                                onChange={(e) =>
                                    handleIngredientChange(index, "name", e.target.value)
                                }
                                required
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
                            />
                            <select
                                value={ingredient.unit}
                                onChange={(e) =>
                                    handleIngredientChange(index, "unit", e.target.value)
                                }
                                required
                            >
                                <option value="">Unit</option>
                                <option value="cups">cups</option>
                                <option value="tbsp">tbsp</option>
                                <option value="tsp">tsp</option>
                                <option value="oz">oz</option>
                                <option value="lb">lb</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="pcs">pcs</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => removeIngredientField(index)}
                                className="btn"
                                style={{
                                    backgroundColor: "var(--error-color)",
                                    color: "white",
                                    padding: "0.3rem 0.5rem",
                                    minWidth: "auto"
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                {/* Button to add more ingredient fields */}
                <button
                    type="button"
                    onClick={addIngredientField}
                    className="btn btn-outline"
                >
                    + Add Ingredient
                </button>
            </div>

            {/* Submit Button */}
            <div style={{ 
                display: "flex", 
                justifyContent: "flex-end",
                marginTop: "var(--spacing-lg)"
            }}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? "Adding Recipe..." : "Add Recipe"}
                </button>
            </div>
        </form>
    );
}

export default AddRecipeForm;
