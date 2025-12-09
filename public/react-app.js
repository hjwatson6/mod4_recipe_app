const { useState, useEffect } = React;

function RecipeList({ recipes, onSelect }) {
  if (!recipes || recipes.length === 0) return <div><h3>No recipes found</h3></div>;
  return (
    <div>
      {recipes.map(r => (
        <div key={r.id} className="recipe" onClick={() => onSelect(r.id)} style={{ cursor: 'pointer' }}>
          <h3>{r.title}</h3>
          <p><strong>Ingredients:</strong> {(r.ingredients || []).join(', ')}</p>
          <p>{r.instructions.slice(0, 120)}{(r.instructions || '').length > 120 ? '…' : ''}</p>
        </div>
      ))}
    </div>
  );
}

function RecipeDetail({ recipe, onBack }) {
  if (!recipe) return null;
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 12 }}>← Back</button>
      <h2>{recipe.title}</h2>
      <h3>Ingredients</h3>
      <ul>
        {(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h3>Instructions</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.instructions}</p>
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
  const [selectedId, setSelectedId] = useState(null);

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

  // bulk add some sample recipes (client-side helper) — posts each sample and appends result
  async function addSampleRecipes() {
    const samples = [
      { title: 'Berry Smoothie', ingredients: ['1 cup berries', '1 banana', '1/2 cup yogurt'], instructions: 'Blend all ingredients until smooth.' },
      { title: 'Grilled Cheese', ingredients: ['2 slices bread', '2 slices cheese', 'butter'], instructions: 'Butter bread, place cheese between slices, grill until golden.' },
      { title: 'Simple Salad', ingredients: ['lettuce', 'tomato', 'cucumber', 'olive oil', 'salt'], instructions: 'Toss ingredients and dress with oil and salt.' }
    ];
    for (const s of samples) {
      try {
        const res = await fetch('/api/recipes', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s)
        });
        if (res.ok) {
          const nr = await res.json();
          setRecipes(prev => [...prev, nr]);
        }
      } catch (err) {
        // ignore individual errors
        console.error('Failed to add sample', err);
      }
    }
  }

  const filtered = recipes.filter(r => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (r.title || '').toLowerCase().includes(q) || (r.ingredients || []).join(' ').toLowerCase().includes(q) || (r.instructions || '').toLowerCase().includes(q);
  });

  const selectedRecipe = recipes.find(r => r.id === selectedId);

  return (
    <div>
      <h1>Recipe App (React)</h1>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <AddRecipeForm onAdd={addRecipe} />
          <div style={{ marginTop: 12 }}>
            <button onClick={addSampleRecipes}>Add sample recipes</button>
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: '12px' }}>
            <input id="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes..." />
          </div>
          {selectedId ? (
            <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedId(null)} />
          ) : (
            <>
              <h2>Recipes</h2>
              <RecipeList recipes={filtered} onSelect={(id) => setSelectedId(id)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
