# Recipe Manager

A modern web application for managing and discovering recipes
This application demonstrates the implementation of a SPA using React and PHP


## Features

- **Recipe Discovery**: Browse through a collection of recipes
- **Personal Recipe Collection**: Save and manage your favorite recipes
- **Recipe Management**: Add, edit, and delete your own recipes
- **Search Functionality**: Find recipes by title or ingredients
- **User-Friendly Interface**: Clean and intuitive navigation

## Technologies Used

### Frontend
- **React.js**: Modern JavaScript library for building user interfaces
- **React Router**: For handling navigation and routing
- **Axios**: For making HTTP requests to the backend API
- **CSS3**: For styling and responsive design
- **LocalStorage API**: For client-side data persistence

### Backend
- **PHP**: Server-side scripting language
- **MySQL**: Database management system
- **Apache**: Web server

### Development Tools
- **Node.js**: JavaScript runtime environment
- **npm**: Package manager for JavaScript
- **Create React App**: For bootstrapping the React application
- **Git**: Version control system

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- PHP (v7.4 or higher)
- MySQL (v5.7 or higher)
- Apache web server
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/recipe-manager.git
   cd recipe-manager
   ```

2. **Install frontend dependencies**
   ```bash
   cd recipe-frontend
   npm install
   ```

3. **Set up the backend**
   - Copy the PHP files to your web server directory (e.g., `C:\wamp64\www\recipe-api`)
   - Create a MySQL database and import the provided schema
   - Update the database connection settings in `config.php`

4. **Configure the application**
   - Update the API endpoint in `src/config.js` if needed
   - Ensure your web server is running and accessible

## Running the Application

1. **Start the frontend development server**
   ```bash
   cd recipe-frontend
   npm start
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost/recipe-api`


## API Endpoints

- `GET /get_recipes.php`: Retrieve all recipes
- `GET /get_ingredients.php?recipe_id={id}`: Get ingredients for a specific recipe
- `POST /add_recipe.php`: Add a new recipe
- `PUT /update_recipe.php`: Update an existing recipe
- `DELETE /delete_recipe.php`: Remove a recipe

