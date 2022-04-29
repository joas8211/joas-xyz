import { access, mkdir, readdir, rmdir } from "fs/promises";

export function isErrnoException(
  error: unknown,
): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export async function ensureDirectory(path: string, accessMode: number) {
  try {
    await access(path, accessMode);
  } catch (error) {
    if (isErrnoException(error) && error.code && error.code == "ENOENT") {
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
    if (isErrnoException(error) && error.code && error.code == "ENOENT") {
      return false;
    }
  }

  return true;
}
