// src/MyRecipes.js
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard"; 

function MyRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);

    // Load recipes from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setSavedRecipes(saved);
    }, []);

    // Update view if a recipe is removed from inside RecipeCard
    const handleUpdate = () => {
        const updated = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setSavedRecipes(updated);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Saved Recipes</h2>
            {savedRecipes.length === 0 ? (
                <p>You haven't saved any recipes yet.</p>
            ) : (
                savedRecipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onUpdate={handleUpdate} // optional refresh
                    />
                ))
            )}
        </div>
    );
}

export default MyRecipes;
