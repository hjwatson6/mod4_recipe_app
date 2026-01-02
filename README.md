# Recipe App

A simple and intuitive recipe management application built with React and Express. This app allows users to browse, search, and add recipes with a clean, modern user interface.

## Features

- **Recipe Display**: View all recipes in an attractive card-based grid layout
- **Recipe Details**: Click on any recipe card to view full details including ingredients and instructions
- **Search Functionality**: Real-time search across recipe titles, ingredients, and instructions
- **Add Recipes**: Create new recipes with a simple form interface
- **Sample Data**: Quick-add sample recipes with one click
- **Data Persistence**: All recipes are saved to a JSON file and persist between sessions

## Tech Stack

- **Frontend**: React 18 (via CDN), JSX with Babel
- **Backend**: Node.js with Express
- **Data Storage**: JSON file (`data/recipes.json`)
- **Styling**: CSS with modern design patterns

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd mod_4_final_project_recipe_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

The server will run on port 3000 by default (or the port specified in the `PORT` environment variable).

## How to Use

### Viewing Recipes
- All recipes are displayed in a card grid on the main page
- Each card shows the recipe title, a preview of ingredients, and a snippet of instructions
- Click on any recipe card to view the full details

### Searching Recipes
- Use the search bar at the top of the recipe list
- Search works in real-time as you type
- Searches across recipe titles, ingredients, and instructions
- Search is case-insensitive

### Adding Recipes
1. Fill out the "Add a recipe" form on the left side:
   - **Title** (required): Enter the recipe name
   - **Ingredients**: Enter ingredients separated by commas (e.g., "flour, sugar, eggs")
   - **Instructions**: Enter step-by-step cooking instructions
2. Click the "Add" button
3. Your new recipe will appear in the recipe list immediately

### Adding Sample Recipes
- Click the "Add sample recipes" button to quickly populate the app with example recipes
- This adds three sample recipes: Berry Smoothie, Grilled Cheese, and Simple Salad

### Viewing Recipe Details
- Click on any recipe card to view the full recipe
- The detail view shows:
  - Complete list of ingredients
  - Full cooking instructions
- Click "← Back to Recipes" to return to the main list

## Project Structure

```
mod_4_final_project_recipe_app/
├── data/
│   └── recipes.json          # Recipe data storage
├── public/
│   ├── index.html            # Main HTML file
│   ├── react-app.js          # React application code
│   ├── app.js                # Alternative vanilla JS implementation (unused)
│   └── styles.css            # Application styles
├── src/
│   ├── server.js             # Express server and API endpoints
│   └── index.js              # Minimal entrypoint
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## API Endpoints

### GET `/api/recipes`
Returns all recipes as a JSON array.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Recipe Name",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": "Step by step instructions..."
  }
]
```

### POST `/api/recipes`
Creates a new recipe.

**Request Body:**
```json
{
  "title": "Recipe Name",
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": "Step by step instructions..."
}
```

**Response:**
Returns the created recipe with a generated ID (status 201).

## Development Notes

### Using GitHub Copilot
This project was developed with assistance from GitHub Copilot in Visual Studio Code. Copilot can help with:
- Generating React components
- Creating API endpoints
- Writing boilerplate code
- Suggesting code completions

### Code Generation with npx
- The project uses React via CDN (no build step required)
- Babel Standalone is used for JSX transformation in the browser
- This setup allows for quick iteration without a build process

## Future Enhancements

Potential improvements for future versions:
- Edit and delete recipe functionality
- Recipe categories/tags
- Image support for recipes
- User authentication
- Recipe favorites/bookmarks
- Export recipes to PDF
- Print-friendly recipe view

## License

ISC
