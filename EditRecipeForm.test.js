// src/EditRecipeForm.test.js
// This file contains tests for the EditRecipeForm component 
// These tests verify that the form correctly loads existing recipe data,
// allows users to modify the data, and handles the update process properly

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import EditRecipeForm from './EditRecipeForm';

// Mock react-router-dom hooks since EditRecipeForm uses them
// Fun fact components using react-router hooks need them to be mocked
// or the component needs to be wrapped in a Router context for testing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'recipe-123' }),
  useNavigate: () => mockNavigate,
}));

// Create a mock of localStorage for testing
// This helps isolate tests from the actual browser storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock axios for potential future API calls
jest.mock('axios');

// Sample recipe data for populating the form in tests
// This represents what would be stored in localStorage or received from an API
const mockExistingRecipe = {
  id: 'recipe-123',
  title: 'Original Recipe Title',
  image_url: 'http://example.com/original.jpg',
  prep_time: '15 mins',
  cook_time: '30 mins',
  instructions: 'Original instructions.',
  ingredients: [
    { name: 'Original Ingredient 1', quantity: '100', unit: 'g' },
    { name: 'Original Ingredient 2', quantity: '2', unit: 'pcs' },
  ],
  isUserCreated: true,
  isFavourite: false,
};

describe('EditRecipeForm Component', () => {
  // Reset mocks and localStorage before each test
  beforeEach(() => {
    localStorageMock.clear();
    mockNavigate.mockClear();
    
    // Add the test recipe to mock localStorage
    localStorageMock.setItem('savedRecipes', JSON.stringify([mockExistingRecipe]));
  });

  test('loads and displays existing recipe data correctly', async () => {
    // Render the component within a Router (needed for navigation hooks)
    render(
      <Router>
        <EditRecipeForm />
      </Router>
    );

    // Wait for the form to load the recipe data
    // This simulates the async nature of data loading in a real application
    expect(await screen.findByDisplayValue('Original Recipe Title')).toBeInTheDocument();

    // Check that all fields are filled with the correct data
    expect(screen.getByDisplayValue('http://example.com/original.jpg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15 mins')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30 mins')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original instructions.')).toBeInTheDocument();
    
    // Verify ingredients are loaded
    expect(screen.getByDisplayValue('Original Ingredient 1')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('100')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('g')[0]).toBeInTheDocument();

    expect(screen.getByDisplayValue('Original Ingredient 2')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('2')[0]).toBeInTheDocument();

    // Check that form buttons are present
    expect(screen.getByRole('button', { name: 'Update Recipe' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('allows modifying recipe data and saves updates correctly', async () => {
    render(
      <Router>
        <EditRecipeForm />
      </Router>
    );
    
    // Wait for data to load
    await screen.findByDisplayValue('Original Recipe Title');

    // Modify title field
    const titleInput = screen.getByDisplayValue('Original Recipe Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Recipe Title' } });
    expect(titleInput.value).toBe('Updated Recipe Title');

    // Modify instructions field
    const instructionsInput = screen.getByDisplayValue('Original instructions.');
    fireEvent.change(instructionsInput, { target: { value: 'Updated instructions.' } });
    expect(instructionsInput.value).toBe('Updated instructions.');

    // Modify an ingredient
    const firstIngredientNameInput = screen.getByDisplayValue('Original Ingredient 1');
    fireEvent.change(firstIngredientNameInput, { target: { value: 'Updated Ingredient 1 Name' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Update Recipe' });
    fireEvent.click(submitButton);

    // Verify localStorage was updated correctly
    const savedRecipesRaw = localStorageMock.getItem("savedRecipes");
    const savedRecipes = JSON.parse(savedRecipesRaw);

    // Check that the recipe was actually updated
    expect(savedRecipes.length).toBe(1);
    const updatedRecipe = savedRecipes.find(r => r.id === 'recipe-123');
    expect(updatedRecipe.title).toBe('Updated Recipe Title');
    expect(updatedRecipe.instructions).toBe('Updated instructions.');
    expect(updatedRecipe.ingredients[0].name).toBe('Updated Ingredient 1 Name');
    expect(updatedRecipe.isUserCreated).toBe(true);

    // Verify navigation back to my-recipes page
    expect(mockNavigate).toHaveBeenCalledWith('/my-recipes');
  });

  test('displays error message when recipe is not found', () => {
    // Override useParams to simulate a non-existent recipe ID
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: 'non-existent-id' });
    
    render(
      <Router>
        <EditRecipeForm />
      </Router>
    );
    
    // Check that error message is displayed
    expect(screen.getByText('Recipe not found')).toBeInTheDocument();
    expect(screen.getByText(/Sorry, we couldn't find that recipe to edit./i)).toBeInTheDocument();
    
    // Clean up the mock
    jest.restoreAllMocks();
  });

  test('cancel button returns to previous page', async () => {
    render(
      <Router>
        <EditRecipeForm />
      </Router>
    );
    
    // Wait for form to load
    await screen.findByDisplayValue('Original Recipe Title');

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });


}); 
