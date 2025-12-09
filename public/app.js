async function fetchRecipes() {
  const res = await fetch('/api/recipes');
  return res.json();
}

function renderRecipes(recipes) {
  const list = document.getElementById('recipe-list');
  list.innerHTML = '';
  if (!recipes.length) {
    list.innerHTML = '<li>No recipes found</li>';
    return;
  }
  recipes.forEach(r => {
    const li = document.createElement('li');
    li.className = 'recipe';
    li.innerHTML = `<h3>${escapeHtml(r.title)}</h3>
      <p><strong>Ingredients:</strong> ${escapeHtml((r.ingredients || []).join(', '))}</p>
      <p>${escapeHtml(r.instructions || '')}</p>`;
    list.appendChild(li);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function applySearch(recipes) {
  const q = (document.getElementById('search-input').value || '').toLowerCase().trim();
  if (!q) return recipes;
  return recipes.filter(r => (r.title || '').toLowerCase().includes(q) || (r.ingredients || []).join(' ').toLowerCase().includes(q));
}

async function init() {
  let recipes = await fetchRecipes();
  const form = document.getElementById('recipe-form');
  const searchInput = document.getElementById('search-input');

  function refresh() {
    const filtered = applySearch(recipes);
    renderRecipes(filtered);
  }

  searchInput.addEventListener('input', refresh);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const ingredients = document.getElementById('ingredients').value.split(',').map(s => s.trim()).filter(Boolean);
    const instructions = document.getElementById('instructions').value.trim();
    if (!title) return alert('Title is required');
    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingredients, instructions })
    });
    if (res.ok) {
      const newRecipe = await res.json();
      recipes.push(newRecipe);
      form.reset();
      refresh();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add recipe');
    }
  });

  refresh();
}

window.addEventListener('DOMContentLoaded', init);
