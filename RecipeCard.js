vimport React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * RecipeCard Component
 * 
 * This component displays a single recipe in a card format with image, basic details,
 * and action buttons for saving, favoriting, editing, and deleting.
 * 
 * @param {Object} recipe - The recipe object to display
 * @param {Function} onUpdate - Callback function when recipe is updated (saved/favorited)
 * @param {Function} onDeleteRecipe - Callback function when recipe is deleted
 */
function RecipeCard({ recipe, onUpdate, onDeleteRecipe }) {
    // State to track if recipe is saved in localStorage
    const [isSaved, setIsSaved] = useState(false);
    // State to track if recipe is marked as a favorite
    const [isFavourite, setIsFavourite] = useState(false);

    // Effect hook to check if recipe is saved and favorited when component mounts
    // or when recipe.id changes
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const found = saved.find(r => r.id === recipe.id);
        if (found) {
            setIsSaved(true);
            setIsFavourite(!!found.isFavourite); // Convert to boolean with !!
        }
    }, [recipe.id]);

    /**
     * Toggle save status of recipe in localStorage
     * If recipe is already saved, it will be removed
     * If not saved, it will be added to localStorage
     */
    const handleToggleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        let updated;

        if (isSaved) {
            // Remove recipe from saved recipes
            updated = saved.filter(r => r.id !== recipe.id);
            setIsFavourite(false); // Reset favorite status when removed
        } else {
            // Add recipe to saved recipes with favorite status as false
            updated = [...saved, { ...recipe, isFavourite: false }];
        }

        // Update localStorage with modified recipes array
        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        // Update local state
        setIsSaved(!isSaved);

        // Call parent component update function if provided
        if (onUpdate) onUpdate();
    };

    /**
     * Toggle favorite status of a saved recipe
     * Only works if the recipe is already saved
     */
    const handleToggleFavourite = () => {
        if (!isSaved) return; // Only allow favoriting of saved recipes

        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        // Map through saved recipes and toggle favorite status for this recipe
        const updated = saved.map(r => {
            if (r.id === recipe.id) {
                return { ...r, isFavourite: !isFavourite };
            }
            return r;
        });

        // Update localStorage and local state
        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsFavourite(!isFavourite);

        // Call parent component update function if provided
        if (onUpdate) onUpdate();
    };

    /**
     * Format ingredients for display
     * Handles different formats of ingredient data (string, array, object)
     * 
     * @returns {Array} Array of formatted ingredient strings
     */
    const formatIngredients = () => {
        // Case 1: Ingredients is a string
        if (typeof recipe.ingredients === 'string') {
            // If comma-separated, split into array; otherwise return as single item array
            return recipe.ingredients.includes(',') 
                ? recipe.ingredients.split(',').map(s => s.trim()) 
                : [recipe.ingredients];
        }
        
        // Case 2: Ingredients is an array
        if (Array.isArray(recipe.ingredients)) {
            return recipe.ingredients.map(ing => {
                // If ingredient is a string, return it directly
                if (typeof ing === 'string') return ing.trim();
                
                // If ingredient is an object with name, quantity, and unit properties
                let ingredientString = '';
                if (ing.quantity) ingredientString += ing.quantity + ' ';
                if (ing.unit) ingredientString += ing.unit + ' ';
                if (ing.name) ingredientString += ing.name;
                return ingredientString.trim();
            }).filter(ing => ing); // Remove any empty strings
        }
        
        // Case 3: Ingredients is an object (not in expected format)
        if (recipe.ingredients && typeof recipe.ingredients === 'object') {
            return ['Ingredients available in recipe details']; 
        }
        
        // Default case: No ingredients or unrecognized format
        return ['No ingredients listed']; 
    };

    // Get formatted ingredients list for this recipe
    const ingredientsList = formatIngredients();

    return (
        <div className="recipe-card">
            {/* Recipe Image (if available) with link to details */}
            {recipe.image_url && (
                <Link to={`/recipe/${recipe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <img 
                        src={recipe.image_url} 
                        alt={recipe.title} 
                        style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: 'var(--border-radius) var(--border-radius) 0 0' 
                        }}
                    />
                </Link>
            )}
            
            <div className="recipe-card-content">
                {/* Recipe Title, Times, and Preview Content - All wrapped in Link */}
                <Link 
                    to={`/recipe/${recipe.id}`} 
                    style={{
                        textDecoration: "none", 
                        color: "inherit",
                        flexGrow: 1, // Push action buttons to bottom
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Recipe Title */}
                    <h3 className="recipe-card-title">{recipe.title}</h3>
                    
                    {/* Prep and Cook Times (if available) */}
                    {(recipe.prep_time || recipe.cook_time) && (
                        <div style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--neutral-medium)', 
                            marginBottom: 'var(--spacing-sm)' 
                        }}>
                            {recipe.prep_time && <span>Prep: {recipe.prep_time}</span>}
                            {recipe.prep_time && recipe.cook_time && <span style={{ margin: '0 0.5em' }}>|</span>}
                            {recipe.cook_time && <span>Cook: {recipe.cook_time}</span>}
                        </div>
                    )}
                    
                    {/* Recipe Details (Ingredients and Instructions) */}
                    <div className="recipe-card-details">
                        <p><strong>Ingredients:</strong></p>
                        {/* Display ingredients as list if available */}
                        {Array.isArray(ingredientsList) && ingredientsList.length > 0 ? (
                            <ul className="recipe-card-ingredients-list">
                                {ingredientsList.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{typeof ingredientsList === 'string' ? ingredientsList : 'No ingredients listed.'}</p>
                        )}
                        
                        {/* Truncated Instructions */}
                        <p style={{ marginTop: 'var(--spacing-sm)' }}><strong>Instructions:</strong> {
                            recipe.instructions && recipe.instructions.length > 150 
                                ? recipe.instructions.substring(0, 150) + '...' 
                                : recipe.instructions
                        }</p>
                    </div>
                </Link>

                {/* Action Buttons (Save, Favorite, Edit, Delete, View) */}
                <div className="recipe-card-actions">
                    {/* Save/Remove Button */}
                    <button 
                        onClick={handleToggleSave}
                        className={`btn ${isSaved ? 'btn-outline' : 'btn-primary'}`}
                        title={isSaved ? "Remove from My Recipes" : "Add to My Recipes"}
                    >
                        {isSaved ? "Remove" : "Add"}
                    </button>

                    {/* Favorite Button (only shown for saved recipes) */}
                    {isSaved && (
                        <button 
                            onClick={handleToggleFavourite}
                            className={`btn btn-favorite ${isFavourite ? 'active' : ''}`}
                            title={isFavourite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavourite ? "★" : "☆"}
                        </button>
                    )}

                    {/* Edit Button (only shown for saved recipes) */}
                    {isSaved && (
                        <Link 
                            to={`/edit-recipe/${recipe.id}`} 
                            className="btn btn-secondary"
                            title="Edit this recipe in My Recipes"
                            style={{ fontSize: '0.9rem', paddingTop: 'var(--spacing-xs)', paddingBottom: 'var(--spacing-xs)' }}
                        >
                            Edit
                        </Link>
                    )}
                    
                    {/* Delete Button (only shown for saved user-created recipes) */}
                    {isSaved && recipe.isUserCreated && (
                        <button 
                            onClick={() => {
                                if (onDeleteRecipe) {
                                    onDeleteRecipe(recipe.id);
                                }
                            }}
                            className="btn btn-outline"
                            title="Delete this recipe permanently"
                            style={{borderColor: 'var(--error-color)', color: 'var(--error-color)'}}
                        >
                            Delete
                        </button>
                    )}
                    
                    {/* View Details Button */}
                    <Link 
                        to={`/recipe/${recipe.id}`} 
                        className="btn btn-secondary"
                        title="View full recipe details"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * RecipeCard Component
 * 
 * This component displays a single recipe in a card format with image, basic details,
 * and action buttons for saving, favoriting, editing, and deleting.
 * 
 * @param {Object} recipe - The recipe object to display
 * @param {Function} onUpdate - Callback function when recipe is updated (saved/favorited)
 * @param {Function} onDeleteRecipe - Callback function when recipe is deleted
 */
function RecipeCard({ recipe, onUpdate, onDeleteRecipe }) {
    // State to track if recipe is saved in localStorage
    const [isSaved, setIsSaved] = useState(false);
    // State to track if recipe is marked as a favorite
    const [isFavourite, setIsFavourite] = useState(false);

    // Effect hook to check if recipe is saved and favorited when component mounts
    // or when recipe.id changes
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const found = saved.find(r => r.id === recipe.id);
        if (found) {
            setIsSaved(true);
            setIsFavourite(!!found.isFavourite); // Convert to boolean with !!
        }
    }, [recipe.id]);

    /**
     * Toggle save status of recipe in localStorage
     * If recipe is already saved, it will be removed
     * If not saved, it will be added to localStorage
     */
    const handleToggleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        let updated;

        if (isSaved) {
            // Remove recipe from saved recipes
            updated = saved.filter(r => r.id !== recipe.id);
            setIsFavourite(false); // Reset favorite status when removed
        } else {
            // Add recipe to saved recipes with favorite status as false
            updated = [...saved, { ...recipe, isFavourite: false }];
        }

        // Update localStorage with modified recipes array
        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        // Update local state
        setIsSaved(!isSaved);

        // Call parent component update function if provided
        if (onUpdate) onUpdate();
    };

    /**
     * Toggle favorite status of a saved recipe
     * Only works if the recipe is already saved
     */
    const handleToggleFavourite = () => {
        if (!isSaved) return; // Only allow favoriting of saved recipes

        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        // Map through saved recipes and toggle favorite status for this recipe
        const updated = saved.map(r => {
            if (r.id === recipe.id) {
                return { ...r, isFavourite: !isFavourite };
            }
            return r;
        });

        // Update localStorage and local state
        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsFavourite(!isFavourite);

        // Call parent component update function if provided
        if (onUpdate) onUpdate();
    };

    /**
     * Format ingredients for display
     * Handles different formats of ingredient data (string, array, object)
     * 
     * @returns {Array} Array of formatted ingredient strings
     */
    const formatIngredients = () => {
        // Case 1: Ingredients is a string
        if (typeof recipe.ingredients === 'string') {
            // If comma-separated, split into array; otherwise return as single item array
            return recipe.ingredients.includes(',') 
                ? recipe.ingredients.split(',').map(s => s.trim()) 
                : [recipe.ingredients];
        }
        
        // Case 2: Ingredients is an array
        if (Array.isArray(recipe.ingredients)) {
            return recipe.ingredients.map(ing => {
                // If ingredient is a string, return it directly
                if (typeof ing === 'string') return ing.trim();
                
                // If ingredient is an object with name, quantity, and unit properties
                let ingredientString = '';
                if (ing.quantity) ingredientString += ing.quantity + ' ';
                if (ing.unit) ingredientString += ing.unit + ' ';
                if (ing.name) ingredientString += ing.name;
                return ingredientString.trim();
            }).filter(ing => ing); // Remove any empty strings
        }
        
        // Case 3: Ingredients is an object (not in expected format)
        if (recipe.ingredients && typeof recipe.ingredients === 'object') {
            return ['Ingredients available in recipe details']; 
        }
        
        // Default case: No ingredients or unrecognized format
        return ['No ingredients listed']; 
    };

    // Get formatted ingredients list for this recipe
    const ingredientsList = formatIngredients();

    return (
        <div className="recipe-card">
            {/* Recipe Image (if available) with link to details */}
            {recipe.image_url && (
                <Link to={`/recipe/${recipe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <img 
                        src={recipe.image_url} 
                        alt={recipe.title} 
                        style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: 'var(--border-radius) var(--border-radius) 0 0' 
                        }}
                    />
                </Link>
            )}
            
            <div className="recipe-card-content">
                {/* Recipe Title, Times, and Preview Content - All wrapped in Link */}
                <Link 
                    to={`/recipe/${recipe.id}`} 
                    style={{
                        textDecoration: "none", 
                        color: "inherit",
                        flexGrow: 1, // Push action buttons to bottom
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Recipe Title */}
                    <h3 className="recipe-card-title">{recipe.title}</h3>
                    
                    {/* Prep and Cook Times (if available) */}
                    {(recipe.prep_time || recipe.cook_time) && (
                        <div style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--neutral-medium)', 
                            marginBottom: 'var(--spacing-sm)' 
                        }}>
                            {recipe.prep_time && <span>Prep: {recipe.prep_time}</span>}
                            {recipe.prep_time && recipe.cook_time && <span style={{ margin: '0 0.5em' }}>|</span>}
                            {recipe.cook_time && <span>Cook: {recipe.cook_time}</span>}
                        </div>
                    )}
                    
                    {/* Recipe Details (Ingredients and Instructions) */}
                    <div className="recipe-card-details">
                        <p><strong>Ingredients:</strong></p>
                        {/* Display ingredients as list if available */}
                        {Array.isArray(ingredientsList) && ingredientsList.length > 0 ? (
                            <ul className="recipe-card-ingredients-list">
                                {ingredientsList.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{typeof ingredientsList === 'string' ? ingredientsList : 'No ingredients listed.'}</p>
                        )}
                        
                        {/* Truncated Instructions */}
                        <p style={{ marginTop: 'var(--spacing-sm)' }}><strong>Instructions:</strong> {
                            recipe.instructions && recipe.instructions.length > 150 
                                ? recipe.instructions.substring(0, 150) + '...' 
                                : recipe.instructions
                        }</p>
                    </div>
                </Link>

                {/* Action Buttons (Save, Favorite, Edit, Delete, View) */}
                <div className="recipe-card-actions">
                    {/* Save/Remove Button */}
                    <button 
                        onClick={handleToggleSave}
                        className={`btn ${isSaved ? 'btn-outline' : 'btn-primary'}`}
                        title={isSaved ? "Remove from My Recipes" : "Add to My Recipes"}
                    >
                        {isSaved ? "Remove" : "Add"}
                    </button>

                    {/* Favorite Button (only shown for saved recipes) */}
                    {isSaved && (
                        <button 
                            onClick={handleToggleFavourite}
                            className={`btn btn-favorite ${isFavourite ? 'active' : ''}`}
                            title={isFavourite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavourite ? "★" : "☆"}
                        </button>
                    )}

                    {/* Edit Button (only shown for saved recipes) */}
                    {isSaved && (
                        <Link 
                            to={`/edit-recipe/${recipe.id}`} 
                            className="btn btn-secondary"
                            title="Edit this recipe in My Recipes"
                            style={{ fontSize: '0.9rem', paddingTop: 'var(--spacing-xs)', paddingBottom: 'var(--spacing-xs)' }}
                        >
                            Edit
                        </Link>
                    )}
                    
                    {/* Delete Button (only shown for saved user-created recipes) */}
                    {isSaved && recipe.isUserCreated && (
                        <button 
                            onClick={() => {
                                if (onDeleteRecipe) {
                                    onDeleteRecipe(recipe.id);
                                }
                            }}
                            className="btn btn-outline"
                            title="Delete this recipe permanently"
                            style={{borderColor: 'var(--error-color)', color: 'var(--error-color)'}}
                        >
                            Delete
                        </button>
                    )}
                    
                    {/* View Details Button */}
                    <Link 
                        to={`/recipe/${recipe.id}`} 
                        className="btn btn-secondary"
                        title="View full recipe details"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;


