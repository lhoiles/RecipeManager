import React, { useEffect, useState } from "react";
import AddRecipeForm from "./AddRecipeForm";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [myRecipes, setMyRecipes] = useState([]);

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    const loadFromLocalStorage = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

        const sorted = saved.sort(
            (a, b) => (b.isFavourite === true) - (a.isFavourite === true)
        );

        setMyRecipes(sorted);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Recipes</h2>

            {/* Add new recipe form */}
            <AddRecipeForm onRecipeAdded={loadFromLocalStorage} />

            {myRecipes.length === 0 ? (
                <p>You haven't added or saved any recipes yet.</p>
            ) : (
                myRecipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onUpdate={loadFromLocalStorage}
                    />
                ))
            )}
        </div>
    );
}

export default MyRecipes;
