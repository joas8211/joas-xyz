import { lstat, readdir } from "fs/promises";
import { extname } from "path";

/**
 * Walks directory and lists all the file paths found within specified depth.
 */
export class DirectoryWalker {
  private modifiedAfter: number;
  private fileExtension?: string;
  private maxDepth: number;

  constructor(
    modifiedAfter: number = 0,
    fileExtension?: string,
    maxDepth = Infinity
  ) {
    this.modifiedAfter = modifiedAfter;
    this.fileExtension = fileExtension;
    this.maxDepth = maxDepth;
  }

  async walk(directory: string, currentDepth = 1) {
    const files: string[] = [];

    for (const file of await readdir(directory)) {
      const path = `${directory}/${file}`;
      const stats = await lstat(path);

      if (
        stats.isFile() &&
        (!this.modifiedAfter || stats.mtime.getTime() > this.modifiedAfter) &&
        (!this.fileExtension || extname(file) == this.fileExtension)
      ) {
        files.push(path);
      }

      if (stats.isDirectory() && currentDepth < this.maxDepth) {
        for (const subPath of await this.walk(path)) {
          files.push(subPath);
        }
      }
    }

    return files;
  }
}
