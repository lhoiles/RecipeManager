import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function RecipeDetails() {
  // Get the recipe ID from the URL
  const { id } = useParams();

  // State to hold the selected recipe
  const [recipe, setRecipe] = useState(null);

  // State to hold the ingredients for that recipe
  const [ingredients, setIngredients] = useState([]);

  // Load recipe and ingredients on first load
  useEffect(() => {
    // Fetch all recipes and find the one with the matching ID
    axios.get("http://localhost/recipe-api/get_recipes.php").then((res) => {
      const foundRecipe = res.data.find((r) => r.id === id);
      setRecipe(foundRecipe);
    });

    // Fetch the ingredients for this recipe ID
    axios
      .get(`http://localhost/recipe-api/get_ingredients.php?recipe_id=${id}`)
      .then((res) => {
        setIngredients(res.data);
      });
  }, [id]);

  // Show loading if recipe not yet loaded
  if (!recipe) return <p>Loading...</p>;

  return (
    <div>
      {/* Link to go back to the main page */}
      <Link to="/">Back to all recipes</Link>

      {/* Recipe title */}
      <h2>{recipe.title}</h2>

      {/* Ingredients list */}
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((ing, index) => (
          <li key={index}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      {/* Cooking instructions */}
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetails;
