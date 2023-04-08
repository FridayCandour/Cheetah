import tar from "tar";
import glob from "glob";
import {
  openSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  closeSync,
  ftruncateSync,
  readdirSync,
  copyFileSync,
  mkdirSync,
  rmSync,
  existsSync,
} from "fs";
import pkg from "fs-ext";
const { flockSync } = pkg;

export async function createFile(file) {
  if (!existsSync(file)) {
    writeFileSync(file, "{}", { flag: "w", encoding: "utf8" });
    return true;
  }
  return false;
}

export async function backupFiles(source) {
  const backup = source + "/.backup";
  // copying
  readdirSync(source).forEach((file) => {
    if (file !== ".backup") {
      copyFileSync(`${source}/${file}`, `${backup}/${file}`);
    }
  });
  // backing up
  const filePattern = `${source}/*.json`;
  const backupFile = "backup.tar.gz";
  const files = await glob(filePattern);
  tar.create({ file: backupFile, cmd: source, gzip: true }, files);
  // deleting copied files
  rmSync(backup, { recursive: true, force: true });
  mkdirSync(backup);
}

export function getFile(filename) {
  try {
    return JSON.parse(readFileSync(filename, "utf-8"));
  } catch (error) {
    return false;
  }
}

export function updateFile(filename, data) {
  // Acquire an exclusive lock on the file
  const fd = openSync(filename, "r+");
  try {
    flockSync(fd, "ex");
    // Read the existing data from the file
    let existingData = {};
    try {
      const fileContents = readFileSync(filename, "utf-8");
      existingData = JSON.parse(fileContents);
    } catch (err) {
      existingData = "";
      // Ignore errors if the file is empty or does not contain valid JSON data
    }

    // Update the data
    Object.assign(existingData, data);

    // Write the updated data to a temporary file
    const tmpFilename = `${filename}.tmp`;
    writeFileSync(tmpFilename, JSON.stringify(existingData));

    // Replace the original file with the updated data
    ftruncateSync(fd, 0);
    writeFileSync(fd, readFileSync(tmpFilename));

    // Remove the temporary file
    unlinkSync(tmpFilename);
  } finally {
    // Release the file lock
    flockSync(fd, "un");
    closeSync(fd);
  }
}
