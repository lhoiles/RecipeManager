import React, { useEffect, useState } from "react";

function RecipeCard({ recipe, onUpdate }) {
    const [isSaved, setIsSaved] = useState(false);

    // On component mount, check if this recipe is already saved in localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setIsSaved(saved.some(r => r.id === recipe.id));
    }, [recipe.id]);

    // Toggle save/remove and update localStorage
    const handleToggleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

        let updated;
        if (isSaved) {
            // Remove this recipe
            updated = saved.filter(r => r.id !== recipe.id);
        } else {
            // Add this recipe
            updated = [...saved, recipe];
        }

        // Save updated list back to localStorage
        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsSaved(!isSaved);

        // Notify parent component to refresh if needed
        if (onUpdate) onUpdate();
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>

            <button onClick={handleToggleSave}>
                {isSaved ? "Remove from My Recipes" : "Add to My Recipes"}
            </button>
        </div>
    );
}

export default RecipeCard;

