// src/MyRecipes.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddRecipeForm from "./AddRecipeForm";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [myRecipes, setMyRecipes] = useState([]);

    useEffect(() => {
        loadMyRecipes();
    }, []);

    const loadMyRecipes = () => {
        // Load from database (user-created ones)
        axios.get("http://localhost/recipe-api/get_recipes.php")
            .then((response) => {
                const dbRecipes = Array.isArray(response.data) ? response.data : [];

                // Load saved recipes from localStorage
                const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

                // Merge without duplication (based on ID)
                const merged = [...saved];

                // Add manually added recipes that aren't already saved
                dbRecipes.forEach(dbRecipe => {
                    const alreadySaved = saved.some(savedRecipe => savedRecipe.id === dbRecipe.id);
                    if (!alreadySaved) {
                        merged.push(dbRecipe);
                    }
                });

                // Favourites first
                const sorted = merged.sort((a, b) => (b.isFavourite === true) - (a.isFavourite === true));
                setMyRecipes(sorted);
            })
            .catch((error) => {
                console.error("Error loading recipes:", error);
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Recipes</h2>

            {/* Add recipe form */}
            <AddRecipeForm onRecipeAdded={loadMyRecipes} />

            {myRecipes.length === 0 ? (
                <p>You haven't added or saved any recipes yet.</p>
            ) : (
                myRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onUpdate={loadMyRecipes} />
                ))
            )}
        </div>
    );
}

export default MyRecipes;


