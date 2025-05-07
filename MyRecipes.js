// src/MyRecipes.js
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        loadSavedRecipes();
    }, []);

    const loadSavedRecipes = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

        // Sort: favourites first
        const sorted = saved.sort((a, b) => {
            return (b.isFavourite === true) - (a.isFavourite === true);
        });

        setSavedRecipes(sorted);
    };

    // Called after toggling save/favourite
    const handleUpdate = () => {
        loadSavedRecipes();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Saved Recipes</h2>
            {savedRecipes.length === 0 ? (
                <p>You haven't saved any recipes yet.</p>
            ) : (
                savedRecipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onUpdate={handleUpdate}
                    />
                ))
            )}
        </div>
    );
}

export default MyRecipes;

