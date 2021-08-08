import { basename, dirname, relative, resolve } from "path";
import { DirectoryWalker } from "../src/DirectoryWalker";
import { Layout } from "../src/Layout";
import { Renderer } from "../src/Renderer";
import { copyFile, readFile, rm, writeFile } from "fs/promises";
import { ensureDirectory, exists, removeEmptyDirectory } from "../src/fsUtils";
import { constants as FS } from "fs";

(async () => {
  const projectDirectory = dirname(__dirname);
  const srcDirectory = `${projectDirectory}/src`;
  const scriptsDirectory = `${projectDirectory}/scripts`;
  const pagesDirectory = `${projectDirectory}/pages`;
  const distDirectory = `${projectDirectory}/dist`;
  const filesDirectory = `${projectDirectory}/files`;
  const cacheFile = `${projectDirectory}/cache.json`;

  let lastGenerated = 0;
  try {
    lastGenerated =
      JSON.parse((await readFile(cacheFile)).toString()).lastGenerated;
  } catch (error) {
    if (error.code != "ENOENT") throw error;
  }

  const sourceWalker = new DirectoryWalker(lastGenerated);
  const sourceChanged = (await sourceWalker.walk(srcDirectory)).length > 0 ||
    (await sourceWalker.walk(scriptsDirectory)).length > 0;
  if (sourceChanged) {
    console.log("Source changed. Doing full generation...");
  }

  const renderer = new Renderer(Layout);
  const outputFiles = [];
  for (
    const file of await new DirectoryWalker(
      sourceChanged ? 0 : lastGenerated,
      ".md",
    ).walk(
      pagesDirectory,
    )
  ) {
    if (!sourceChanged) {
      console.log(`Modified page: ${relative(pagesDirectory, file)}`);
    }

    let filePath = relative(pagesDirectory, file);
    if (basename(filePath) == "index.md") {
      filePath = filePath.substr(0, filePath.length - 3) + ".html";
    } else {
      filePath = filePath.substr(0, filePath.length - 3) + "/index.html";
    }
    let webPath = "/" + dirname(filePath).replace(".", "");

    const content = (await readFile(file)).toString();
    const result = await renderer.render(content, webPath);

    filePath = resolve(distDirectory, filePath);
    console.log(filePath);
    await ensureDirectory(dirname(filePath), FS.W_OK);
    await writeFile(filePath, result);
    outputFiles.push(filePath);
  }

  for (
    const src of await new DirectoryWalker(sourceChanged ? 0 : lastGenerated)
      .walk(
        filesDirectory,
      )
  ) {
    if (!sourceChanged) {
      console.log(`Modified file: ${relative(filesDirectory, src)}`);
    }
    const dest = resolve(distDirectory, relative(filesDirectory, src));
    await ensureDirectory(dirname(dest), FS.W_OK);
    await copyFile(src, dest);
    outputFiles.push(dest);
  }

  for (
    const path of await new DirectoryWalker().walk(
      distDirectory,
    )
  ) {
    const file = relative(distDirectory, path);
    if (
      await exists(resolve(filesDirectory, file)) ||
      (basename(file) == "index.html" &&
        (await exists(
          resolve(pagesDirectory, file.substr(0, file.length - 4) + "md"),
        ) || await exists(resolve(pagesDirectory, dirname(file) + ".md"))))
    ) {
      continue;
    }

    console.log(`Removed file: ${file}`);
    await rm(path);
    await removeEmptyDirectory(dirname(path));
  }

  const data = { lastGenerated: Date.now() };
  await ensureDirectory(dirname(cacheFile), FS.W_OK);
  await writeFile(cacheFile, JSON.stringify(data));
})().catch((reason) => console.error(reason));
