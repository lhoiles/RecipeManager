// App.js
// This is the root component of the Recipe Manager application.
// It sets up the main routing structure and the overall layout including the navigation bar.

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css"; // Importing global application styles

// Importing page/feature components
import RecipeList from "./RecipeList"; // Component to display all public recipes 
import MyRecipes from "./MyRecipes"; // Component for user-specific saved recipes
import RecipeDetails from "./RecipeDetails"; // Component to show detailed view of a single recipe
import SearchBar from "./SearchBar"; // Reusable search bar component used in the navbar
import EditRecipeForm from "./EditRecipeForm"; // Component to edit an existing recipe

function App() {
    // The handleSearchResultClick was originally designed to navigate from the SearchBar lol
    // However!!! if SearchBar handles its own navigation or result display internally,
    // this specific handler might be simplified if SearchBar becomes more self contained.
    // For now tho it demonstrates a potential way to handle clicks from a child component.
    const handleSearchResultClick = (recipe) => {
        // Using window.location.href for navigation is a simpler approach for this project phase.
        // For more complex SPA behavior, `useNavigate` hook from react-router-dom would be preferred within components.
        window.location.href = `/recipe/${recipe.id}`;
    };

    return (
        <Router> {/* BrowserRouter provides routing capabilities to the app */} 
            <div className="App"> {/* Main application wrapper, styled in App.css */} 
                {/* Navigation bar: consistent across all pages */}
                <nav className="navbar">
                    <div className="container navbar-container"> {/* Centering and layout for navbar items */} 
                        <div className="navbar-brand">Recipe Manager</div>
                        
                        {/* Main navigation links */}
                        <div className="navbar-links">
                            <Link to="/">Home</Link> {/* Link to the homepage (RecipeList) */} 
                            <Link to="/my-recipes">My Recipes</Link> {/* Link to user's personal recipes */} 
                        </div>

                        {/* Search bar integrated into the navbar */}
                        {/* Note to self - Passing onResultClick to SearchBar allows App to control navigation from search results. */}
                        {/* This could be refactored for SearchBar to handle its own navigation if preferred. */}
                        <div className="navbar-search">
                            <SearchBar onResultClick={handleSearchResultClick} />
                        </div>
                    </div>
                </nav>

                {/* Main content area where page components are rendered based on the route */}
                <main className="main-content">
                    <div className="container"> {/* Consistent padding and max-width for page content */} 
                        {/* Routes define the component to render for each URL path */}
                        <Routes>
                            <Route path="/" element={<RecipeList />} /> {/* Homepage route */}
                            <Route path="/my-recipes" element={<MyRecipes />} /> {/* "My Recipes" page route */}
                            <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* Route for specific recipe details, with a dynamic ID parameter */}
                            <Route path="/edit-recipe/:id" element={<EditRecipeForm />} /> {/* Route for editing a recipe */}
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
