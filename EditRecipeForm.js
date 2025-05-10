import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Included for future API integration

/**
 * EditRecipeForm Component
 * 
 * This component allows users to edit existing recipes stored in localStorage.
 * It demonstrates the use of React hooks and form handling.
 * 
 *I made this to allow users to modify their saved recipes
 * with proper validation and error handling.
 */
function EditRecipeForm() {
    // Get recipe ID from URL parameters using react-router-dom's useParams hook
    const { id } = useParams();
    // Navigate hook for programmatic navigation after form submission
    const navigate = useNavigate();

    // State variables to manage form fields and component state
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
    const [originalRecipe, setOriginalRecipe] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // useEffect hook runs when component mounts and when id changes
    // This loads the recipe data from localStorage
    useEffect(() => {
        // Retrieve all saved recipes from localStorage
        const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        // Find the specific recipe to edit based on the ID from URL params
        const recipeToEdit = savedRecipes.find(recipe => recipe.id === id);

        if (recipeToEdit) {
            // Store the original recipe for reference
            setOriginalRecipe(recipeToEdit);
            
            // Populate form fields with recipe data
            setTitle(recipeToEdit.title || "");
            setImageUrl(recipeToEdit.image_url || "");
            setPrepTime(recipeToEdit.prep_time || "");
            setCookTime(recipeToEdit.cook_time || "");
            setInstructions(recipeToEdit.instructions || "");

            // Handle ingredients - ensuring proper formatting
            // This accounts for different ways ingredients might be stored
            let initialIngredients = [{ name: "", quantity: "", unit: "" }]; // Default
            
            if (Array.isArray(recipeToEdit.ingredients) && recipeToEdit.ingredients.length > 0) {
                // If ingredients are already in the proper array format
                initialIngredients = recipeToEdit.ingredients;
            } else if (typeof recipeToEdit.ingredients === 'string' && recipeToEdit.ingredients.trim() !== "") {
                // If ingredients are stored as a comma separated string
                // Convert to array of objects with name, quantity, unit
                initialIngredients = recipeToEdit.ingredients.split(',').map(name => ({
                    name: name.trim(),
                    quantity: "",
                    unit: ""
                }));
                
                // Handle edge case of empty array after split
                if (initialIngredients.length === 0) {
                    initialIngredients = [{ name: recipeToEdit.ingredients.trim(), quantity: "", unit: "" }];
                }
            }
            
            setIngredients(initialIngredients);
        } else {
            // If recipe not found then show error state
            setNotFound(true);
        }
    }, [id]); // Dependency array with id ensures effect runs when id changes

    // Handler for ingredient field changes
    const handleIngredientChange = (index, field, value) => {
        // Create a copy of the ingredients array to maintain immutability
        const updated = [...ingredients];
        // Update the specific field for the ingredient at the given index
        updated[index][field] = value;
        // Set the updated array as the new state
        setIngredients(updated);
    };

    // Add a new empty ingredient field
    const addIngredientField = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    // Remove an ingredient field at the specified index
    const removeIngredientField = (index) => {
        // Filter out the ingredient at the specified index
        const updated = ingredients.filter((_, i) => i !== index);
        
        // Always maintain at least one ingredient field
        if (updated.length === 0) {
            setIngredients([{ name: "", quantity: "", unit: "" }]);
        } else {
            setIngredients(updated);
        }
    };

    // Handle form submission
    const handleUpdateRecipe = (e) => {
        e.preventDefault(); // Prevent default form submission
        setSubmitting(true); // Set submitting state to show loading indicator

        // Create updated recipe object
        const updatedRecipeData = {
            ...originalRecipe, // Keep original properties like id
            title,
            image_url: imageUrl,
            prep_time: prepTime,
            cook_time: cookTime,
            instructions,
            // Remove empty ingredients
            ingredients: ingredients.filter(i => i.name && (i.quantity || i.unit)),
            isUserCreated: true, // Mark as user-created/edited
        };

        // Update recipe in localStorage
        const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        // Replace original recipe with updated one
        const updatedRecipes = savedRecipes.map(recipe =>
            recipe.id === id ? updatedRecipeData : recipe
        );
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));

        console.log("Recipe updated in localStorage:", updatedRecipeData);
        

        setSubmitting(false);
        alert("Recipe updated successfully!");
        navigate(`/my-recipes`); // Navigate back to My Recipes page
    };

    // Show error message if recipe not found
    if (notFound) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
                <h2>Recipe not found</h2>
                <p>Sorry, we couldn't find that recipe to edit.</p>
                <button onClick={() => navigate('/my-recipes')} className="btn btn-primary">Back to My Recipes</button>
            </div>
        );
    }
    
    // Show loading state while recipe is being fetched
    if (!originalRecipe) {
         return <p>Loading recipe...</p>;
    }

    // Main form rendering
    return (
        <div style={{ 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            maxWidth: '700px',
            margin: 'var(--spacing-xl) auto'
        }}>
            <h3 style={{ marginBottom: "var(--spacing-md)", textAlign: 'center' }}>Edit Recipe: {originalRecipe.title}</h3>
            
            <form onSubmit={handleUpdateRecipe}>
                {/* Title Field */}
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                    <label htmlFor="recipeTitle" style={{display: 'block', marginBottom: 'var(--spacing-xs)'}}>Title</label>
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
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>

                {/* Prep & Cook Time Fields - Displayed side by side using flex */}
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
                    <div style={{ backgroundColor: "var(--neutral-bg)", padding: "var(--spacing-md)", borderRadius: "var(--border-radius)", marginBottom: "var(--spacing-md)" }}>
                        {ingredients.map((ingredient, index) => (
                            <div
                                key={index}
                                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)", alignItems: "center" }}
                            >
                                <input
                                    type="text"
                                    placeholder="Ingredient Name"
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                    required={ingredients.length > 1 || (ingredient.quantity || ingredient.unit)}
                                />
                                <input
                                    type="text"
                                    placeholder="Qty"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                                />
                                <input 
                                    type="text"
                                    placeholder="Unit"
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeIngredientField(index)}
                                    className="btn"
                                    style={{ backgroundColor: "var(--error-color)", color: "white", padding: "0.3rem 0.5rem", minWidth: "auto" }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addIngredientField}
                        className="btn btn-outline"
                    >
                        + Add Ingredient
                    </button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--spacing-lg)" }}>
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ marginRight: 'var(--spacing-sm)'}}
                        onClick={() => navigate(-1)} // Go back to previous page
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update Recipe"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditRecipeForm; 
