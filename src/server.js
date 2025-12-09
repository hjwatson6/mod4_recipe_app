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
  } catch (err) {
    console.error('Failed to write recipes:', err);
  }
}

app.get('/api/recipes', (req, res) => {
  const recipes = readRecipes();
  res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
  const recipes = readRecipes();
  const { title, ingredients, instructions } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const newRecipe = {
    id: Date.now().toString(),
    title,
    ingredients: ingredients || [],
    instructions: instructions || ''
  };
  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json(newRecipe);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
