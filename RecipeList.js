// RecipeList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard"; // This must exist and be correctly named

function RecipeList() {
    // Start with an empty array so .length and .map always work
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        axios.get("http://localhost/recipe-api/get_recipes.php")
            .then(response => {
                // Make sure the response is actually an array
                if (Array.isArray(response.data)) {
                    setRecipes(response.data);
                } else {
                    console.error("Unexpected data format from API:", response.data);
                    setRecipes([]); // fallback to empty array
                }
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
                setRecipes([]); // fallback to empty array
            });
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>All Recipes</h2>

            {/* Show fallback text if no recipes are found */}
            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))
            )}
        </div>
    );
}

export default RecipeList;
