// src/AddRecipeForm.test.js
// This file contains unit and integration tests for the AddRecipeForm component.
// We use Jest as the test runner and React Testing Library (RTL) for rendering and interacting with components.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom Jest matchers for DOM elements

import AddRecipeForm from './AddRecipeForm';


// This allows us to test the component in isolation without making real API calls or relying on browser features.

// Mocking localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mocking axios for API calls
// jest.mock('axios') tells Jest to use a mock version for all imports of 'axios'.
jest.mock('axios'); 
const mockedAxios = require('axios'); // Now we can access the mocked version

describe('AddRecipeForm Component', () => {
  // Helper function to fill common form fields
  const fillCommonFields = () => {
    fireEvent.change(screen.getByPlaceholderText('Recipe Title'), { target: { value: 'Test Recipe Title' } });
    fireEvent.change(screen.getByPlaceholderText('Image URL (e.g., https://example.com/image.jpg)'), { target: { value: 'http://example.com/image.png' } });
    fireEvent.change(screen.getByPlaceholderText('Prep Time (e.g., 20 mins)'), { target: { value: '10 mins' } });
    fireEvent.change(screen.getByPlaceholderText('Cook Time (e.g., 1 hour)'), { target: { value: '20 mins' } });
    fireEvent.change(screen.getByPlaceholderText('Instructions'), { target: { value: 'Test instructions.' } });
    
    // Fill the first ingredient
    fireEvent.change(screen.getAllByPlaceholderText('Ingredient Name')[0], { target: { value: 'Test Ingredient' } });
    fireEvent.change(screen.getAllByPlaceholderText('Qty')[0], { target: { value: '1' } });
    // Assuming the unit select is the first one. If you changed it to input, adjust selector.
    // For <select>, you target the select element itself for the change event.
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'pcs' } }); 
  };

  let mockOnRecipeAdded;

  beforeEach(() => {
    // Reset mocks before each test to ensure test isolation
    localStorageMock.clear();
    mockedAxios.post.mockClear();
    mockOnRecipeAdded = jest.fn(); // Create a new mock function for the callback
  });

  test('renders all input fields and buttons correctly', () => {
    render(<AddRecipeForm onRecipeAdded={mockOnRecipeAdded} />);

    // Check for main input fields by their placeholder text
    expect(screen.getByPlaceholderText('Recipe Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Image URL (e.g., https://example.com/image.jpg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Prep Time (e.g., 20 mins)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cook Time (e.g., 1 hour)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Instructions')).toBeInTheDocument();

    // Check for initial ingredient fields
    expect(screen.getByPlaceholderText('Ingredient Name')).toBeInTheDocument(); // Will find the first one
    expect(screen.getByPlaceholderText('Qty')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /unit/i })).toBeInTheDocument(); // More accessible way to find select by implicit label

    // Check for buttons
    expect(screen.getByRole('button', { name: '+ Add Ingredient' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Recipe' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument(); // Initial remove button for the first ingredient
  });

  test('allows user input to update state for text fields', () => {
    render(<AddRecipeForm onRecipeAdded={mockOnRecipeAdded} />);
    
    const titleInput = screen.getByPlaceholderText('Recipe Title');
    fireEvent.change(titleInput, { target: { value: 'Delicious Pasta' } });
    expect(titleInput.value).toBe('Delicious Pasta');

    const instructionsInput = screen.getByPlaceholderText('Instructions');
    fireEvent.change(instructionsInput, { target: { value: 'Mix and bake.' } });
    expect(instructionsInput.value).toBe('Mix and bake.');
  });

  test('allows adding and removing ingredient fields', () => {
    render(<AddRecipeForm onRecipeAdded={mockOnRecipeAdded} />);
    
    // Initially one ingredient row
    let ingredientNameInputs = screen.getAllByPlaceholderText('Ingredient Name');
    expect(ingredientNameInputs.length).toBe(1);

    // Add another ingredient
    const addIngredientButton = screen.getByRole('button', { name: '+ Add Ingredient' });
    fireEvent.click(addIngredientButton);
    ingredientNameInputs = screen.getAllByPlaceholderText('Ingredient Name');
    expect(ingredientNameInputs.length).toBe(2);

    // Remove the first ingredient
    // The "×" buttons are associated with each ingredient row.
    const removeIngredientButtons = screen.getAllByRole('button', { name: '×' });
    fireEvent.click(removeIngredientButtons[0]); 
    ingredientNameInputs = screen.getAllByPlaceholderText('Ingredient Name');
    expect(ingredientNameInputs.length).toBe(1);
  });

  test('form submission calls axios.post and onRecipeAdded callback, updates localStorage', async () => {
    // Mock a successful response from axios.post
    mockedAxios.post.mockResolvedValue({ data: { recipe_id: 'test-123' } });
    // Initialize localStorage with an empty array for "savedRecipes"
    localStorageMock.setItem("savedRecipes", "[]");

    render(<AddRecipeForm onRecipeAdded={mockOnRecipeAdded} />);
    fillCommonFields(); // Use the helper to fill the form

    const submitButton = screen.getByRole('button', { name: 'Add Recipe' });
    fireEvent.click(submitButton);

    // Wait for the mocked axios call and subsequent state updates
    // `waitFor` is used for async operations that update the DOM
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    // Verify axios was called with the correct URL and data structure
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost/recipe-api/add_recipe.php", 
      expect.objectContaining({ // Check for presence of key fields in the submitted data
        title: 'Test Recipe Title',
        instructions: 'Test instructions.',
        image_url: 'http://example.com/image.png',
        prep_time: '10 mins',
        cook_time: '20 mins',
        ingredients: expect.arrayContaining([
          expect.objectContaining({ name: 'Test Ingredient', quantity: '1', unit: 'pcs' })
        ])
      })
    );

    // Verify onRecipeAdded callback was called
    expect(mockOnRecipeAdded).toHaveBeenCalledTimes(1);

    // Verify localStorage was updated
    // Retrieve the item and parse it since its stored as a JSON string
    const savedRecipesRaw = localStorageMock.getItem("savedRecipes");
    expect(savedRecipesRaw).not.toBeNull();
    const savedRecipes = JSON.parse(savedRecipesRaw);
    
    expect(savedRecipes.length).toBe(1);
    expect(savedRecipes[0]).toEqual(expect.objectContaining({
      title: 'Test Recipe Title',
      isUserCreated: true // Check for the flag
    }));

    // Check if form fields were cleared 
    expect(screen.getByPlaceholderText('Recipe Title').value).toBe('');
  });
  
  test('form submission handles API error gracefully', async () => {
    // Mock an error response from axios.post
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));
    // Spy on console.error to ensure errors are logged
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<AddRecipeForm onRecipeAdded={mockOnRecipeAdded} />);
    fillCommonFields();

    const submitButton = screen.getByRole('button', { name: 'Add Recipe' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
    
    // Check that console.error was called due to the API error
    expect(consoleErrorSpy).toHaveBeenCalled();
    // onRecipeAdded should not be called if there's an error
    expect(mockOnRecipeAdded).not.toHaveBeenCalled();
    // Form fields should ideally not be cleared on error
    expect(screen.getByPlaceholderText('Recipe Title').value).toBe('Test Recipe Title');

    consoleErrorSpy.mockRestore(); // Restore original console.error
  });


}); 
