# Running this project on Replit

This project is a static website made with HTML and CSS. To run it, start the
Replit workflow named **Start application**. It serves the project files on port
5000, with `index.html` as the home page.

The workflow command is:

```sh
python3 serve.py
```

`serve.py` is a tiny static server (port 5000) that sends `Cache-Control: no-cache`,
so browsers always pick up the latest CSS and JavaScript after a refresh.

The other pages are `gallery.html`, `artists.html`, and `contact.html`.

## Project structure

- `index.html`, `gallery.html`, `artists.html`, `contact.html`: the pages
- `style.css`: all styling; colors, fonts and spacing are CSS variables at the top (`:root`)
- `script.js`: menu, scroll animations, gallery filter and lightbox, testimonials, live opening hours, booking form
- `hero.webp`: compressed copy of `hero.png` (the PNG is kept as the fallback)
- `favicon.svg`: browser tab icon

No build step or dependencies; it's plain HTML, CSS and JavaScript.
