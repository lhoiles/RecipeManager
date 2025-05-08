import React, { useEffect, useState } from "react";
import AddRecipeForm from "./AddRecipeForm";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [allRecipes, setAllRecipes] = useState([]);       // All saved recipes
    const [searchQuery, setSearchQuery] = useState("");      // User input
    const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtered results

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    // Update filtered results when recipes or search changes
    useEffect(() => {
        const filtered = allRecipes.filter((recipe) => {
            const titleMatch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
            const ingredientsMatch = (recipe.ingredients || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return titleMatch || ingredientsMatch;
        });

        // Favourites first
        const sorted = filtered.sort(
            (a, b) => (b.isFavourite === true) - (a.isFavourite === true)
        );

        setFilteredRecipes(sorted);
    }, [searchQuery, allRecipes]);

    const loadFromLocalStorage = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setAllRecipes(saved);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Recipes</h2>

            {/* Search input */}
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Search your recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem"
                    }}
                />
            </div>

            {/* Add Recipe form */}
            <AddRecipeForm onRecipeAdded={loadFromLocalStorage} />

            {/* Show filtered recipes */}
            {filteredRecipes.length === 0 ? (
                <p>No matching recipes found.</p>
            ) : (
                filteredRecipes.map((recipe) => (
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
