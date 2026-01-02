const { useState, useEffect, useRef } = React;

function RecipeList({ recipes, onSelect }) {
  if (!recipes || recipes.length === 0) return <div><h3>No recipes found</h3></div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {recipes.map(r => (
        <div 
          key={r.id} 
          className="recipe-card" 
          onClick={() => onSelect(r.id)} 
          style={{ 
            cursor: 'pointer',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{r.title}</h3>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
            <strong>Ingredients:</strong> {(r.ingredients || []).slice(0, 3).join(', ')}
            {(r.ingredients || []).length > 3 ? '...' : ''}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#888' }}>
            {((r.instructions || '').slice(0, 100))}{(r.instructions || '').length > 100 ? '…' : ''}
          </p>
        </div>
      ))}
    </div>
  );
}

function RecipeDetail({ recipe, onBack }) {
  if (!recipe) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <button 
        onClick={onBack} 
        style={{ 
          marginBottom: 16,
          padding: '8px 16px',
          background: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Recipes
      </button>
      <h2 style={{ marginTop: 0, color: '#333' }}>{recipe.title}</h2>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#555', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Ingredients</h3>
        <ul style={{ lineHeight: '1.8' }}>
          {(recipe.ingredients || []).map((ing, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{ing}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#555', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Instructions</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#444' }}>{recipe.instructions}</p>
      </div>
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => { if (mountedRef.current) setRecipes(data); })
      .catch(() => { if (mountedRef.current) setRecipes([]); });
    return () => { mountedRef.current = false; };
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
