import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

/**
 * RecipeDetails Component
 * 
 * This component displays the full details of a recipe, including image,
 * ingredients, and cooking instructions. It fetches data from the PHP API
 * and allows users to save, edit, or print the recipe.
 */
function RecipeDetails() {
  // Get the recipe ID from the URL using react-router-dom's useParams hook
  const { id } = useParams();

  // State variables to store component data
  const [recipe, setRecipe] = useState(null);        // The recipe details
  const [ingredients, setIngredients] = useState([]); // Ingredients list from API
  const [isLoading, setIsLoading] = useState(true);   // Loading status
  const [isSaved, setIsSaved] = useState(false);      // Whether recipe is saved

  /**
   * Effect hook to fetch recipe data when component mounts or ID changes
   * Uses axios to make API requests to the PHP backend
   */
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch the recipe details from the main recipes endpoint
    const fetchRecipe = axios.get("http://localhost/recipe-api/get_recipes.php")
      .then((res) => {
        const foundRecipe = res.data.find((r) => r.id === id);
        setRecipe(foundRecipe);
        
        // Check if this recipe is already saved in localStorage
        const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const isSavedInStorage = savedRecipes.some(r => r.id === id);
        setIsSaved(isSavedInStorage);
      });

    // Fetch the ingredients specifically for this recipe
    const fetchIngredients = axios
      .get(`http://localhost/recipe-api/get_ingredients.php?recipe_id=${id}`)
      .then((res) => {
        setIngredients(res.data);
      });
      
    // Use Promise.all to wait for both requests to complete
    Promise.all([fetchRecipe, fetchIngredients])
      .catch(err => console.error("Error loading recipe details:", err))
      .finally(() => setIsLoading(false));
  }, [id]); // Re-run effect when recipe ID changes
  
  /**
   * Toggle whether the recipe is saved in localStorage
   * If already saved, remove it and if not saved add it
   */
  const handleToggleSave = () => {
    if (!recipe) return;
    
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    
    if (isSaved) {
      // Remove recipe from saved collection
      const updated = savedRecipes.filter(r => r.id !== id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add recipe to saved collection
      const recipeToSave = {
        ...recipe,
        isFavourite: false // Initialize as not favorited
      };
      localStorage.setItem("savedRecipes", JSON.stringify([...savedRecipes, recipeToSave]));
      setIsSaved(true);
    }
  };
  
  /**
   * Handle printing the recipe
   * Uses the browser's built-in print functionality
   */
  const handlePrint = () => {
    window.print();
  };

  // Display loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
        <p>Loading recipe details...</p>
      </div>
    );
  }
  
  // Display error state if recipe not found
  if (!recipe) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
        <h2>Recipe not found</h2>
        <p>Sorry, we couldn't find that recipe.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
          Back to all recipes
        </Link>
      </div>
    );
  }

  /**
   * Helper function to render ingredients list
   * Handles different data formats for ingredients (API response, string, array of objects)
   */
  const renderIngredients = () => {
    // Case 1: If we have ingredients from the API as objects
    if (ingredients.length > 0) {
      return ingredients.map((ing, index) => (
        <li key={index} style={{ 
          padding: 'var(--spacing-xs) 0',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          <span style={{ fontWeight: '500' }}>
            {ing.quantity} {ing.unit}
          </span> {ing.name}
        </li>
      ));
    }
    
    // Case 2: If recipe.ingredients is a string
    if (typeof recipe.ingredients === 'string') {
      return <li>{recipe.ingredients}</li>;
    }
    
    // If recipe.ingredients is an array of objects or strings
    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.map((ing, index) => (
        <li key={index} style={{ 
          padding: 'var(--spacing-xs) 0',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          {typeof ing === 'string' ? (
            ing
          ) : (
            <>
              <span style={{ fontWeight: '500' }}>
                {ing.quantity} {ing.unit}
              </span> {ing.name}
            </>
          )}
        </li>
      ));
    }
    
    // Default case: Unknown ingredient format
    return <li>No ingredient information available</li>;
  };

  // Main component render
  return (
    <div className="container" style={{ maxWidth: '800px', padding: 'var(--spacing-lg) 0' }}>
      {/* Navigation back to recipes list */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }} className="no-print">
        <Link to="/" className="btn btn-outline">
          ← Back to all recipes
        </Link>
      </div>

      {/* Recipe Image (if available) */}
      {recipe.image_url && (
        <div style={{ 
          marginBottom: 'var(--spacing-lg)', 
          textAlign: 'center',
          borderRadius: 'var(--border-radius)',
          overflow: 'hidden'
        }}>
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: 'var(--border-radius)'
            }} 
          />
        </div>
      )}

      {/* Recipe Title and Times */}
      <div className="page-header" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
        <h1>{recipe.title}</h1>
        {(recipe.prep_time || recipe.cook_time) && (
          <div style={{
            fontSize: '1rem',
            color: 'var(--neutral-medium)',
            marginTop: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {recipe.prep_time && <span><strong>Prep Time:</strong> {recipe.prep_time}</span>}
            {recipe.prep_time && recipe.cook_time && <span style={{ margin: '0 1em' }}>|</span>}
            {recipe.cook_time && <span><strong>Cook Time:</strong> {recipe.cook_time}</span>}
          </div>
        )}
      </div>

      {/* Main Content: Ingredients and Instructions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', // 1/3 for ingredients, 2/3 for instructions
        gap: 'var(--spacing-lg)',
        backgroundColor: 'white',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--box-shadow)'
      }}>
        {/* Ingredients Column */}
        <div>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ingredients</h3>
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0,
            margin: 0
          }}>
            {renderIngredients()}
          </ul>
        </div>

        {/* Instructions Column */}
        <div>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Instructions</h3>
          <div style={{ lineHeight: '1.8' }}>
            {/* Split instructions by newlines and render as paragraphs */}
            {recipe.instructions.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons (Save, Edit, Print) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-xl)' 
      }} className="no-print">
        <button 
          className={`btn ${isSaved ? 'btn-outline' : 'btn-primary'}`}
          onClick={handleToggleSave}
        >
          {isSaved ? "Remove from My Recipes" : "Save Recipe"}
        </button>
        {/* Show Edit button only for saved recipes */}
        {isSaved && (
            <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-secondary">
                Edit Recipe
            </Link>
        )}
        <button 
          className="btn btn-outline"
          onClick={handlePrint}
        >
          Print Recipe
        </button>
      </div>
      
      {/* Print Stylesheet - CSS rules for when the page is printed */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print { 
              display: none !important; 
            }
            .navbar, .main-content > .container > *:not(.recipe-details) {
              display: none !important;
            }
            body { 
              background-color: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            a { 
              text-decoration: none !important;
              color: inherit !important;
            }
          }
        `
      }} />
    </div>
  );
}

export default RecipeDetails;
