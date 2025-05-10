// src/SearchBar.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function SearchBar({ onResultClick }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searchMyRecipesOnly, setSearchMyRecipesOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        // Set a small delay before searching to avoid excessive API calls
        const searchTimeout = setTimeout(() => {
            setIsLoading(true);
            setError(null);

            if (searchMyRecipesOnly) {
                try {
                    const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
                    const filtered = saved.filter(recipe => {
                        const titleMatch = recipe.title.toLowerCase().includes(query.toLowerCase());
                        
                        // Check if ingredients is a string before calling toLowerCase
                        let ingredientsMatch = false;
                        if (typeof recipe.ingredients === 'string') {
                            ingredientsMatch = recipe.ingredients.toLowerCase().includes(query.toLowerCase());
                        }

                        return titleMatch || ingredientsMatch;
                    });
                    setResults(filtered);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error parsing saved recipes:", err);
                    setError("Error searching saved recipes");
                    setIsLoading(false);
                }
            } else {
                axios.get("http://localhost/recipe-api/get_recipes.php")
                    .then(res => {
                        const all = res.data;
                        const filtered = all.filter(recipe => {
                            const titleMatch = recipe.title.toLowerCase().includes(query.toLowerCase());
                            
                            // Check if ingredients is a string before calling toLowerCase
                            let ingredientsMatch = false;
                            if (typeof recipe.ingredients === 'string') {
                                ingredientsMatch = recipe.ingredients.toLowerCase().includes(query.toLowerCase());
                            }

                            return titleMatch || ingredientsMatch;
                        });
                        setResults(filtered);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error("Error fetching all recipes:", err);
                        setError("Error searching recipes");
                        setIsLoading(false);
                    });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(searchTimeout);
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
        <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
            <div style={{ 
                display: "flex", 
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                borderRadius: "var(--border-radius)",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ 
                        flex: 1, 
                        padding: "0.75rem var(--spacing-md)",
                        border: "none",
                        outline: "none",
                        fontSize: "1rem"
                    }}
                />
                <button
                    onClick={() => setSearchMyRecipesOnly(!searchMyRecipesOnly)}
                    className={`btn ${searchMyRecipesOnly ? 'btn-primary' : 'btn-outline'}`}
                    style={{ 
                        margin: "0.25rem", 
                        borderRadius: "var(--border-radius)"
                    }}
                >
                    {searchMyRecipesOnly ? "My Recipes" : "All Recipes"}
                </button>
            </div>

            {isLoading && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid var(--neutral-light)",
                    borderTop: "none",
                    padding: "var(--spacing-md)",
                    textAlign: "center",
                    zIndex: 999,
                    borderRadius: "0 0 var(--border-radius) var(--border-radius)",
                    boxShadow: "var(--box-shadow)"
                }}>
                    Searching...
                </div>
            )}

            {error && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#ffebee",
                    border: "1px solid var(--error-color)",
                    borderTop: "none",
                    padding: "var(--spacing-md)",
                    textAlign: "center",
                    zIndex: 999,
                    borderRadius: "0 0 var(--border-radius) var(--border-radius)",
                    boxShadow: "var(--box-shadow)",
                    color: "var(--error-color)"
                }}>
                    {error}
                </div>
            )}

            {!isLoading && !error && results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid var(--neutral-light)",
                    borderTop: "none",
                    borderRadius: "0 0 var(--border-radius) var(--border-radius)",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    zIndex: 999,
                    maxHeight: "300px",
                    overflowY: "auto",
                    boxShadow: "var(--box-shadow)"
                }}>
                    {results.map(recipe => (
                        <li
                            key={recipe.id}
                            onClick={() => {
                                setQuery("");
                                setResults([]);
                                onResultClick(recipe);
                            }}
                            style={{ 
                                padding: "var(--spacing-md)",
                                borderBottom: "1px solid rgba(0,0,0,0.05)",
                                cursor: "pointer",
                                transition: "background-color var(--transition-speed)"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--neutral-bg)"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                            <strong>{recipe.title}</strong>
                            {typeof recipe.ingredients === 'string' && recipe.ingredients && (
                                <div style={{ 
                                    fontSize: "0.9rem", 
                                    color: "var(--neutral-medium)", 
                                    marginTop: "var(--spacing-xs)"
                                }}>
                                    {recipe.ingredients.split(',').slice(0, 3).join(', ')}
                                    {recipe.ingredients.split(',').length > 3 ? '...' : ''}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
