// RecipeList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard"; // This must exist and be correctly named

function RecipeList() {
    // Start with an empty array so .length and .map always work
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost/recipe-api/get_recipes.php")
            .then(response => {
                // Make sure the response is actually an array lol
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1>Discover Recipes</h1>
                <p>Browse through our collection of delicious recipes</p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading recipes...</p>
                </div>
            ) : recipes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No recipes found.</p>
                </div>
            ) : (
                <div className="recipe-grid">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecipeList;

