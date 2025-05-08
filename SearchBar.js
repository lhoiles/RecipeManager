// src/SearchBar.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function SearchBar({ onResultClick }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searchMyRecipesOnly, setSearchMyRecipesOnly] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        if (searchMyRecipesOnly) {
            const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
            const filtered = saved.filter(recipe =>
                recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                (recipe.ingredients || "").toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            axios.get("http://localhost/recipe-api/get_recipes.php")
                .then(res => {
                    const all = res.data;
                    const filtered = all.filter(recipe =>
                        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                        (recipe.ingredients || "").toLowerCase().includes(query.toLowerCase())
                    );
                    setResults(filtered);
                })
                .catch(err => console.error("Error fetching all recipes:", err));
        }
    }, [query, searchMyRecipesOnly]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem" }}
                />
                <button
                    onClick={() => setSearchMyRecipesOnly(!searchMyRecipesOnly)}
                    style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
                >
                    {searchMyRecipesOnly ? "My Recipes Only" : "All Recipes"}
                </button>
            </div>

            {results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    zIndex: 999,
                    maxHeight: "200px",
                    overflowY: "auto"
                }}>
                    {results.map(recipe => (
                        <li
                            key={recipe.id}
                            onClick={() => {
                                setResults([]);
                                onResultClick(recipe);
                            }}
                            style={{ padding: "0.5rem", borderBottom: "1px solid #eee", cursor: "pointer" }}
                        >
                            <strong>{recipe.title}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
