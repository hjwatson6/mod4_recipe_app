# mod_4_final_project_recipe_app

Minimal scaffold for the recipe app project.

What I added:
- package.json (created with `npm init -y`)
- `.gitignore`
- `src/index.js` (minimal entrypoint)
- `.github/workflows/ci.yml` (Node.js CI workflow)

Quick start

1. Install dependencies (if any are added later):

   npm install

2. Run locally:

   npm start

Using npx and GitHub Copilot for code generation

- To scaffold templates via npx you can run commands like:
  - `npx create-react-app my-app` or other project generators
  - For small code generation tasks you can run `npx`-based tools installed locally or via one-off npx usage.

- GitHub Copilot in VS Code can help generate components, tests, and boilerplate. Open a file in VS Code and accept Copilot suggestions (install/enable the extension via VS Code Extensions).

Pushing to GitHub

1. Create a remote repo on GitHub (or use the `gh` CLI):

   gh repo create <owner>/<repo> --public --source=. --remote=origin --push

If you don't have the GitHub CLI, create the repo at https://github.com/new and then:

   git remote add origin git@github.com:<owner>/<repo>.git
   git branch -M main
   git add .
   git commit -m "chore: initial scaffold"
   git push -u origin main

Notes

- This scaffold is intentionally minimal so you can iterate quickly. I recommend enabling GitHub Copilot in VS Code for faster code generation (it will suggest completions inline).
