import { Raw } from "@bikeshaving/crank";
import { createElement as h } from "@bikeshaving/crank";

export function Layout(
  { title, content }: { title?: string; content: string },
) {
  return (
    <html>
      <head>
        <title>{title || "Untitled page"}</title>
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>
        <main>
          <Raw value={content} />
        </main>
      </body>
    </html>
  );
}
