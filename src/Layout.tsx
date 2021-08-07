import { Raw } from "@bikeshaving/crank";
import { createElement as h } from "@bikeshaving/crank";

export function Layout(
  { title, content, path }: { title?: string; content: string; path: string },
) {
  return (
    <html lang="en">
      <head>
        <title>{title || "Untitled page"} | Jesse Sivonen</title>
        <link rel="stylesheet" href="/index.css" />
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Header path={path} />
        <main>
          <Raw value={content} />
        </main>
      </body>
    </html>
  );
}

function Header({ path: currentPath }: { path: string }) {
  const items = {
    "About Me": "/",
    "My Projects": "/projects",
  };

  const coordinatesLeft = [];
  const coordinatesRight = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      coordinatesLeft.push({ x: x, y: y });
      coordinatesLeft.push({ x: x - 0.5, y: y - 0.5 });
      coordinatesRight.push({ x: -x, y: y });
      coordinatesRight.push({ x: -x + 0.5, y: y - 0.5 });
    }
  }

  return (
    <header>
      <div class="hero">
        <div class="pattern">
          {coordinatesLeft.map(({ x, y }, i) =>
            <div
              class="square left"
              style={`--i: ${i}; --x: ${x}; --y: ${y}`}
            />
          )}
          {coordinatesRight.map(({ x, y }, i) =>
            <div
              class="square right"
              style={`--i: ${i}; --x: ${x}; --y: ${y}`}
            />
          )}
        </div>
        <div class="content-container">
          <img src="/hills.jpg" />
          <div class="title-column">
            <div class="title-container">
              <h1>Jesse Sivonen</h1>
              <p>Self-learned web developer</p>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          {Object.entries(items).map(([text, path]) => (
            <li class={path == currentPath ? "current" : null}>
              <a href={path}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
