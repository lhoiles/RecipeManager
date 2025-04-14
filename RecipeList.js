// Import React and the component that shows each recipe
import React from "react";
import RecipeCard from "./RecipeCard";

// This component receives the list of recipes and the update function as props
function RecipeList({ recipes, onUpdate }) {
    return (
        <>
            {/* If there are no recipes, show a message */}
            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                // Loop through the recipes and show each one using RecipeCard
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} onUpdate={onUpdate} />
                    ))}
                </ul>
            )}
        </>
    );
}

// Export so App.js can use this component
export default RecipeList;
