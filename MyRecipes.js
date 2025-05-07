// src/MyRecipes.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddRecipeForm from "./AddRecipeForm";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [allRecipes, setAllRecipes] = useState([]);

    // Load recipes from database + localStorage
    useEffect(() => {
        fetchAllRecipes();
    }, []);

    const fetchAllRecipes = () => {
        axios.get("http://localhost/recipe-api/get_recipes.php")
            .then((response) => {
                const databaseRecipes = Array.isArray(response.data) ? response.data : [];

                const localSaved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

                // Merge unique recipes from both sources (prevent duplicates)
                const merged = [];

                const seenIds = new Set();

                [...localSaved, ...databaseRecipes].forEach((recipe) => {
                    if (!seenIds.has(recipe.id)) {
                        merged.push(recipe);
                        seenIds.add(recipe.id);
                    }
                });

                // Favourites first
                const sorted = merged.sort((a, b) => (b.isFavourite === true) - (a.isFavourite === true));
                setAllRecipes(sorted);
            })
            .catch((error) => {
                console.error("Error loading recipes:", error);
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Recipes</h2>

            {/* Form to create a new recipe */}
            <AddRecipeForm onRecipeAdded={fetchAllRecipes} />

            {/* Show all saved or added recipes */}
            {allRecipes.length === 0 ? (
                <p>You haven't added or saved any recipes yet.</p>
            ) : (
                allRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onUpdate={fetchAllRecipes} />
                ))
            )}
        </div>
    );
}

export default MyRecipes;


