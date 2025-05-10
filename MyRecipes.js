import React, { useEffect, useState } from "react";
import AddRecipeForm from "./AddRecipeForm";
import RecipeCard from "./RecipeCard";

/**
 * MyRecipes Component
 * 
 * This component displays and manages the user's saved recipe collection.
 * It provides functionality for searching, filtering by favorites, adding new recipes,
 * and deleting user-created recipes.
 * 
 * I implemented this page to allow users to maintain
 * their personalized recipe collection with intuitive filtering options.
 */
function MyRecipes() {
    // State variables for managing recipes and UI
    const [allRecipes, setAllRecipes] = useState([]);           // All saved recipes from localStorage
    const [searchQuery, setSearchQuery] = useState("");         // User's search input
    const [filteredRecipes, setFilteredRecipes] = useState([]); // Recipes after filtering
    const [showAddForm, setShowAddForm] = useState(false);      // Toggle for add recipe form
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Filter for favorites only

    // Load saved recipes from localStorage when component mounts
    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    /**
     * Delete a recipe from the collection
     * 
     * @param {string} recipeId - ID of the recipe to delete
     */
    const handleDeleteRecipe = (recipeId) => {
        // Remove the recipe from the current state
        const updatedRecipes = allRecipes.filter(recipe => recipe.id !== recipeId);
        setAllRecipes(updatedRecipes);

        // Update localStorage with the modified recipe collection
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));

        // TODO: For future extension, add API call to delete from database
        // Example: axios.delete(`/api/recipes/${recipeId}`)
        console.log(`Recipe ${recipeId} deleted from MyRecipes and localStorage.`);
    };

    /**
     * Filter and sort recipes based on search query and favorites filter
     * This effect runs whenever search query, recipes list, or favorites filter changes
     */
    useEffect(() => {
        let recipesToFilter = allRecipes;

        // Step 1: Apply favorites filter if enabled
        if (showFavoritesOnly) {
            recipesToFilter = recipesToFilter.filter(recipe => recipe.isFavourite === true);
        }

        // Step 2: Apply search query filter to titles and ingredients
        const lowerSearchQuery = searchQuery.toLowerCase();
        const searched = recipesToFilter.filter((recipe) => {
            // If search is empty, include all recipes
            if (searchQuery.trim() === "") return true;

            // Check if title contains the search query
            const titleMatch = recipe.title.toLowerCase().includes(lowerSearchQuery);
            
            // Check if any ingredient contains the search query
            let ingredientsMatch = false;
            
            // Handle different formats of ingredients data
            if (Array.isArray(recipe.ingredients)) {
                // For ingredients stored as array of objects
                ingredientsMatch = recipe.ingredients.some(ing => 
                    ing.name && ing.name.toLowerCase().includes(lowerSearchQuery)
                );
            } else if (typeof recipe.ingredients === 'string') {
                // For ingredients stored as string (older format)
                ingredientsMatch = recipe.ingredients.toLowerCase().includes(lowerSearchQuery);
            }

            // Include recipe if either title or ingredients match
            return titleMatch || ingredientsMatch;
        });

        // Step 3: Sort results - favorites first
        const sorted = searched.sort(
            (a, b) => (b.isFavourite === true) - (a.isFavourite === true)
        );

        // Update the filtered recipes state
        setFilteredRecipes(sorted);
    }, [searchQuery, allRecipes, showFavoritesOnly]);

    /**
     * Load recipes from localStorage
     * Used on initial load and after updates to refresh the list
     */
    const loadFromLocalStorage = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setAllRecipes(saved);
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <h1>My Recipe Collection</h1>
                <p>Manage your personal collection of saved recipes</p>
            </div>

            {/* Search and Add Recipe Controls */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
            }}>
                {/* Search Input */}
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <input
                        type="text"
                        placeholder="Search your recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                {/* Toggle Add Recipe Form Button */}
                <button 
                    className="btn btn-primary" 
                    style={{ marginLeft: 'var(--spacing-md)' }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? "Hide Form" : "Add New Recipe"}
                </button>
            </div>

            {/* Favorites Filter Toggle */}
            <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center' }}>
                <label htmlFor="favoritesFilter" style={{ marginRight: 'var(--spacing-sm)', fontWeight: '500' }}>
                    Show Favorites Only:
                </label>
                <input 
                    type="checkbox" 
                    id="favoritesFilter"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    style={{ height: '1.25rem', width: '1.25rem' }}
                />
            </div>

            {/* Add Recipe Form (conditionally rendered) */}
            {showAddForm && (
                <div style={{ 
                    marginBottom: 'var(--spacing-xl)', 
                    padding: 'var(--spacing-lg)',
                    backgroundColor: 'white',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--box-shadow)'
                }}>
                    <AddRecipeForm onRecipeAdded={() => {
                        loadFromLocalStorage(); // Refresh recipe list
                        setShowAddForm(false);  // Hide form after successful add
                    }} />
                </div>
            )}

            {/* Recipe List or Empty State */}
            {filteredRecipes.length === 0 ? (
                // Empty state message when no recipes match filters
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No matching recipes found.</p>
                </div>
            ) : (
                // Grid of recipe cards
                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onUpdate={loadFromLocalStorage}
                            onDeleteRecipe={handleDeleteRecipe}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRecipes;
