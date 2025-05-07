import React, { useEffect, useState } from "react";

function RecipeCard({ recipe }) {
    const [isSaved, setIsSaved] = useState(false);

    // Load saved state from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setIsSaved(saved.some(r => r.id === recipe.id));
    }, [recipe.id]);

    // Toggle save/remove
    const handleToggleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

        let updated;
        if (isSaved) {
            // Remove from saved
            updated = saved.filter(r => r.id !== recipe.id);
        } else {
            // Add to saved
            updated = [...saved, recipe];
        }

        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsSaved(!isSaved);
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
