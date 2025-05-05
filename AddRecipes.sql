-- insert recipes
INSERT INTO recipes (id, title, ingredients, instructions) VALUES
(1, 'Pancakes', '', 'In a bowl, whisk together flour, milk, and eggs until smooth. Pour batter into a hot greased pan and cook until bubbles form. Flip and cook until golden.'),
(2, 'Classic Grilled Cheese', '', 'Butter the outsides of two slices of bread. Place cheese between them. Grill on a skillet until both sides are golden brown and cheese is melted.'),
(3, 'Spaghetti Bolognese', '', 'Cook spaghetti according to package directions. In a pan, cook ground beef with onion and garlic. Add tomato sauce and simmer. Serve sauce over pasta.');

-- insert ingredients
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(1, 'All-purpose flour', 1.00, 'cups'),
(1, 'Milk', 1.25, 'cups'),
(1, 'Eggs', 1.00, 'pcs'),

(2, 'Bread slices', 2.00, 'pcs'),
(2, 'Cheddar cheese', 2.00, 'slices'),
(2, 'Butter', 1.00, 'tbsp'),

(3, 'Spaghetti', 8.00, 'oz'),
(3, 'Ground beef', 0.50, 'lb'),
(3, 'Tomato sauce', 1.00, 'cups'),
(3, 'Onion', 0.50, 'pcs'),
(3, 'Garlic cloves', 2.00, 'pcs');

-----------------------------------------------

--adding more recipes so i can visualise how they would appear as a display on the website
INSERT INTO recipes (id, title, ingredients, instructions) VALUES
(4, 'Chicken Caesar Salad', '', 'Grill chicken breasts and slice thinly. Toss romaine lettuce with Caesar dressing, croutons, and parmesan. Top with sliced chicken and serve chilled.'),
(5, 'Beef Tacos', '', 'Cook ground beef with taco seasoning. Warm taco shells in the oven. Fill with beef, lettuce, cheese, and salsa. Serve with sour cream if desired.'),
(6, 'Chocolate Chip Cookies', '', 'Preheat oven to 350°F. Cream butter and sugars, then beat in eggs and vanilla. Mix in dry ingredients and chocolate chips. Drop spoonfuls onto a baking sheet and bake for 10–12 minutes.'),
(7, 'Mac and Cheese', '', 'Boil elbow macaroni until tender. In a saucepan, melt butter, add flour to make a roux, then whisk in milk. Stir in cheese until melted. Combine with pasta and bake if desired.'),
(8, 'Tomato Basil Soup', '', 'Sauté onion and garlic in olive oil. Add canned tomatoes and simmer. Blend until smooth, then stir in cream and fresh basil. Serve hot with croutons or grilled cheese.');

-- Insert ingredients for each recipe (recipe_id = matches above)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
-- Chicken Caesar Salad
(4, 'Romaine lettuce', 4.00, 'cups'),
(4, 'Chicken breast', 1.00, 'pcs'),
(4, 'Caesar dressing', 0.25, 'cups'),
(4, 'Parmesan cheese', 0.25, 'cups'),
(4, 'Croutons', 0.50, 'cups'),

-- Beef Tacos
(5, 'Ground beef', 0.75, 'lb'),
(5, 'Taco seasoning', 1.00, 'tbsp'),
(5, 'Taco shells', 6.00, 'pcs'),
(5, 'Shredded lettuce', 1.00, 'cups'),
(5, 'Shredded cheddar cheese', 0.50, 'cups'),
(5, 'Salsa', 0.25, 'cups'),

-- Chocolate Chip Cookies
(6, 'Butter', 1.00, 'cups'),
(6, 'White sugar', 0.50, 'cups'),
(6, 'Brown sugar', 0.50, 'cups'),
(6, 'Eggs', 2.00, 'pcs'),
(6, 'Vanilla extract', 1.00, 'tsp'),
(6, 'All-purpose flour', 2.25, 'cups'),
(6, 'Baking soda', 1.00, 'tsp'),
(6, 'Salt', 0.50, 'tsp'),
(6, 'Chocolate chips', 2.00, 'cups'),

-- Mac and Cheese
(7, 'Elbow macaroni', 2.00, 'cups'),
(7, 'Butter', 2.00, 'tbsp'),
(7, 'All-purpose flour', 2.00, 'tbsp'),
(7, 'Milk', 2.00, 'cups'),
(7, 'Cheddar cheese', 2.00, 'cups'),

-- Tomato Basil Soup
(8, 'Olive oil', 1.00, 'tbsp'),
(8, 'Onion', 1.00, 'pcs'),
(8, 'Garlic cloves', 2.00, 'pcs'),
(8, 'Canned tomatoes', 28.00, 'oz'),
(8, 'Heavy cream', 0.50, 'cups'),
(8, 'Fresh basil', 0.25, 'cups');
