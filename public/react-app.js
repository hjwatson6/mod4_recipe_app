const { useState, useEffect } = React;

function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) return <div><h3>No recipes found</h3></div>;
  return (
    <div>
      {recipes.map(r => (
        <div key={r.id} className="recipe">
          <h3>{r.title}</h3>
          <p><strong>Ingredients:</strong> {(r.ingredients || []).join(', ')}</p>
          <p>{r.instructions}</p>
        </div>
      ))}
    </div>
  );
}

function AddRecipeForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    const payload = {
      title: title.trim(),
      ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
      instructions: instructions.trim()
    };
    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const newRecipe = await res.json();
      onAdd(newRecipe);
      setTitle(''); setIngredients(''); setInstructions('');
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Failed to add recipe');
    }
  }

  return (
    <form onSubmit={handleSubmit} id="recipe-form">
      <h2>Add a recipe</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <input value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Ingredients (comma separated)" />
      <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Instructions" />
      <button type="submit">Add</button>
    </form>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => { if (mounted) setRecipes(data); })
      .catch(() => { if (mounted) setRecipes([]); });
    return () => { mounted = false; };
  }, []);

  function addRecipe(newRecipe) {
    setRecipes(prev => [...prev, newRecipe]);
  }

  const filtered = recipes.filter(r => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (r.title || '').toLowerCase().includes(q) || (r.ingredients || []).join(' ').toLowerCase().includes(q) || (r.instructions || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <h1>Recipe App (React)</h1>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <AddRecipeForm onAdd={addRecipe} />
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: '12px' }}>
            <input id="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes..." />
          </div>
          <h2>Recipes</h2>
          <RecipeList recipes={filtered} />
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
