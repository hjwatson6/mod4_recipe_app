const express = require('express');
const path = require('path');
const fs = require('fs');

const DATA_FILE = path.join(__dirname, '..', 'data', 'recipes.json');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

function readRecipes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeRecipes(recipes) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write recipes:', err);
    return false;
  }
}

app.get('/api/recipes', (req, res) => {
  try {
    const recipes = readRecipes();
    res.json(recipes);
  } catch (err) {
    console.error('Error in GET /api/recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.post('/api/recipes', (req, res) => {
  try {
    const recipes = readRecipes();
    const { title, ingredients, instructions } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title is required and must be a non-empty string' });
    }
    
    // Ensure ingredients is an array
    let ingredientsArray = [];
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        ingredientsArray = ingredients;
      } else if (typeof ingredients === 'string') {
        ingredientsArray = ingredients.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        return res.status(400).json({ error: 'ingredients must be an array or comma-separated string' });
      }
    }
    
    const newRecipe = {
      id: Date.now().toString(),
      title: title.trim(),
      ingredients: ingredientsArray,
      instructions: (instructions || '').trim()
    };
    
    recipes.push(newRecipe);
    
    if (!writeRecipes(recipes)) {
      return res.status(500).json({ error: 'Failed to save recipe' });
    }
    
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error in POST /api/recipes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
