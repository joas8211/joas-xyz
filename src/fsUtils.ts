import { access, mkdir, readdir, rmdir } from "fs/promises";

export async function ensureDirectory(path: string, accessMode: number) {
  try {
    await access(path, accessMode);
  } catch (error) {
    if (error.code == "ENOENT") {
      await mkdir(path, { recursive: true });
    } else {
      throw error;
    }
  }
}

export async function removeEmptyDirectory(path: string) {
  if ((await readdir(path)).length == 0) {
    await rmdir(path);
  }
}

export async function exists(path: string) {
  try {
    await access(path);
  } catch (error) {
    if (error.code == "ENOENT") return false;
  }

  return true;
}
