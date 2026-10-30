# The Cosmic Forge — Shivansh Shah

An immersive, peaceful 3D portfolio: a meditating Shiva-inspired presence emerges from cosmic mist behind a central floating sanctuary with a Shivling and continuous Abhishek water. Exactly six floating islands surround it — About, Projects, Leadership, Achievements, Contact Me, Upcoming — each opening a real content panel.

Built with **React + Vite + TypeScript**, **Three.js**, **React Three Fiber**, and **Drei**. No backend, no database, no paid services. Deploys free to GitHub Pages.

## Stack

- React 18 + Vite 7 + TypeScript
- three.js + @react-three/fiber + @react-three/drei
- Tailwind CSS for the HTML/UI layer
- Lucide React for icons
- Web Audio API for the optional ambient drone (no audio assets)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
npm run typecheck  # type-check only
```

## Deploy to GitHub Pages

This project uses a configurable Vite `base` path so assets load correctly from a GitHub Pages project URL (`https://<user>.github.io/<repo>/`).

### One-time setup

1. Push this repository to GitHub.
2. In your repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

### Automated deploy (recommended)

A workflow is included at `.github/workflows/deploy.yml`. On every push to `main` it builds the site with `VITE_BASE_PATH` set to `/<repo-name>/` and publishes to GitHub Pages.

You only need to make sure the repo name in the workflow matches your actual repository name. The workflow sets `VITE_BASE_PATH` automatically from the repository name, so for a repo named `cosmic-forge` it builds with base `/cosmic-forge/`.

If you deploy to a **user/organization root page** (`https://<user>.github.io/`), set `VITE_BASE_PATH=/` in the workflow instead.

### Manual deploy (alternative)

```bash
# Replace <repo-name> with your GitHub repository name
VITE_BASE_PATH=/<repo-name>/ npm run build
npx gh-pages -d dist
```

## Notes

- The 3D scene is the visual environment. All website text, buttons, labels, and navigation live in the HTML/React layer, never inside the 3D models.
- Sound is **off by default** and only starts after an explicit user gesture (the Enter button or the sound toggle).
- `prefers-reduced-motion` is respected — camera parallax and CSS animations are neutralized.
- If WebGL is unavailable, the site falls back to a static message while keeping all navigation and content panels fully usable.
- The portfolio content is factual and editable in `src/data/portfolio.ts`.

## Editing content

All portfolio copy, links, and project descriptions live in [`src/data/portfolio.ts`](src/data/portfolio.ts). Update that file to change names, blurbs, status labels, or links.

## License

Personal portfolio content © Shivansh Shah. Code structure is free to learn from.
