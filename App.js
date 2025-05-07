import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import your page components
import RecipeList from "./RecipeList";
import MyRecipes from "./MyRecipes";

function App() {
    return (
        <Router>
            {/* Top navigation bar */}
            <nav style={{ padding: "1rem", backgroundColor: "#f2f2f2" }}>
                <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
                <Link to="/my-recipes">My Recipes</Link>
            </nav>

            {/* Page routes */}
            <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/my-recipes" element={<MyRecipes />} />
            </Routes>
        </Router>
    );
}

export default App;
