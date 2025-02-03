# RecipeManager
Creating a Web Application - Recipe Manager

**Recipe Manager Web Application - Project Outline**

The Recipe Manager web application will allow users to:

1. Add new recipes with a title, ingredients, and instructions.  
2. View a list of saved recipes.  
3. Edit or delete existing recipes.  
4. Search for recipes by name.

<h3> Technologies Used: <h3/>  

<table>
  <tr>
    <th>Component</th>
    <th>Technology</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>React (JavaScript)</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>PHP (API)</td>
  </tr>
    <tr>
    <td>Database</td>
    <td>MySQL</td>
  </tr>
    <tr>
    <td>Styling</td>
    <td>Bootstrap</td>
  </tr>
  <tr>
    <td>Hosting</td>
    <td>mi-linux.wlv.ac.uk</td>
  </tr>
  <tr>
    <td>Version Control</td>
    <td>Git (GitHub)</td>
  </tr>
</table>

<h3>Features:</h3>
  
Recipe Management:
<ul>
  <li>Add a new recipe (title, ingredients, instructions).</li>
  <li>Edit or delete recipes.</li>
  <li>View a list of recipes.</li>
  <li>Search for recipes by name.</li>
</ul>

User-friendly Interface:
<ul>
  <li>Simple and clean UI using React and Bootstrap.</li>
</ul>

Database Storage
<ul> 
  <li>Recipes will be stored in a MySQL database.</li>
  <li>Each recipe will have an ID, title, ingredients, and instructions.</li>
</ul>

API Integration:
<ul>
  <li>The React frontend will communicate with the PHP backend using an API.</li>
  <li>API will handle CRUD operations (Create, Read, Update, Delete).</li>
</ul>

<h3>Implementation Plan:</h3>
Frontend (React)
<ul>
  <li>Build a homepage displaying a list of recipes.</li>
  <li>Create a form page for adding new recipes.</li>
  <li>Implement an edit/delete feature.</li>
  <li>Use Axios to send API requests.</li>
</ul>

Backend (PHP and SQL)
<ul>
  <li>Create a MySQL database with a recipes table.</li>
  <li>Implement PHP API endpoints:</li>
</ul>

<table>
  <tr>
    <th>GET /recipes</th>
    <th>Retrieve all recipes.</th>
  </tr>
    <tr>
    <th>POST /recipes</th>
    <th>Add a new recipe.</th>
  </tr>
    <tr>
    <th>PUT /recipes/:id</th>
    <th>Edit a recipe.</th>
  </tr>
    <tr>
    <th>DELETE /recipes/:id</th>
    <th>Delete a recipe.</th>
  </tr>
</table>

Hosting and Deployment:
<ul>
  <li>Upload PHP backend to mi-linux.wlv.ac.uk.</li>
  <li>Deploy React frontend (either on GitHub Pages or another method).</li>
  <li>Ensure database connectivity.</li>
  <li>Testing</li>
</ul>
