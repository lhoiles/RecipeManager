import React, { useEffect, useState } from "react";

function RecipeCard({ recipe, onUpdate }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    // Check if this recipe is already saved and if it's favourited
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const found = saved.find(r => r.id === recipe.id);
        if (found) {
            setIsSaved(true);
            setIsFavourite(!!found.isFavourite);
        }
    }, [recipe.id]);

    // Save or remove recipe from localStorage
    const handleToggleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        let updated;

        if (isSaved) {
            updated = saved.filter(r => r.id !== recipe.id);
            setIsFavourite(false); // unfavourite when removed
        } else {
            updated = [...saved, { ...recipe, isFavourite: false }];
        }

        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsSaved(!isSaved);

        if (onUpdate) onUpdate();
    };

    // Toggle favourite status (only for saved recipes)
    const handleToggleFavourite = () => {
        if (!isSaved) return;

        const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const updated = saved.map(r => {
            if (r.id === recipe.id) {
                return { ...r, isFavourite: !isFavourite };
            }
            return r;
        });

        localStorage.setItem("savedRecipes", JSON.stringify(updated));
        setIsFavourite(!isFavourite);

        if (onUpdate) onUpdate();
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button onClick={handleToggleSave}>
                    {isSaved ? "Remove from My Recipes" : "Add to My Recipes"}
                </button>

                {isSaved && (
                    <button onClick={handleToggleFavourite}>
                        {isFavourite ? "★ Favourite" : "☆ Favourite"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default RecipeCard;
