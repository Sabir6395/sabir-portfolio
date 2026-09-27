# Sabir's Portfolio

A personal portfolio website styled like a software verification report, built with plain HTML, CSS and JavaScript.

**Live site:** _coming soon_

## Tech stack

- **HTML5**: semantic, accessible markup
- **CSS3**: custom properties (design tokens), Flexbox, Grid, media queries
- **JavaScript**: vanilla, no frameworks or build tools

## Folder structure

```
.
├── index.html        # The page: all sections and content
├── css/
│   └── style.css     # Design tokens, layout and component styles
├── js/
│   └── main.js       # Mobile menu, typing animation, scroll effects
├── assets/
│   ├── favicon.svg   # Green check mark icon
│   └── profile.jpg   # Profile photo
├── .gitignore        # OS and editor files Git should skip
└── README.md
```

## Features

- Terminal-style hero with a one-time typing animation
- Experience timeline shown as "test case" cards with ✓ PASS badges
- Project cards with CI-style "status: passing" badges and tech tags
- Sticky navbar with a mobile hamburger menu and active-section highlighting
- Sections fade in on scroll using `IntersectionObserver`
- Fully responsive, from 375px phones to wide desktops
- Accessible: keyboard navigation, skip link, screen-reader text and WCAG AA color contrast
- Respects `prefers-reduced-motion`: no animations for visitors who turn them off

## Run locally

No installation needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/Sabir6395/sabir-portfolio.git
   cd sabir-portfolio
   ```
2. Start a local server (requires Python 3):
   ```bash
   python -m http.server 8000
   ```
3. Open <http://localhost:8000> in your browser.

You can also open `index.html` directly in a browser, but a local server behaves more like the live site.

## Author

**Mohammad Sabir Shareef**: [github.com/Sabir6395](https://github.com/Sabir6395)
