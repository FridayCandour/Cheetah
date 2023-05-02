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
  // @ts-ignore
} from "fs";

import pkg from "fs-ext";
const { flockSync } = pkg;

async function createFile(file) {
  if (!existsSync(file)) {
    writeFileSync(file, "{}", { flag: "w", encoding: "utf8" });
    return true;
  }
  return false;
}

async function backupFiles(source) {
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

function getFile(filename) {
  try {
    return JSON.parse(readFileSync(filename, "utf-8"));
  } catch (error) {
    return undefined;
  }
}

function updateFile(filename, data) {
  // Acquire an exclusive lock on the file
  const fd = openSync(filename, "r+");
  let existingData = {};
  try {
    flockSync(fd, "ex");
    // Read the existing data from the file
    try {
      const fileContents = readFileSync(filename, "utf-8");
      existingData = JSON.parse(fileContents);
    } catch (err) {
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

  return existingData;
}

export default class cheetah {
  cheetahDirectory;
  cacheSize;
  cache = {};
  constructor(init) {
    const { Directory, cacheSize } =
      typeof init === "object"
        ? init
        : { cacheSize: 100, Directory: "CheetahDB" };
    this.cheetahDirectory = Directory;
    this.cacheSize = cacheSize;
    // operations
    try {
      mkdirSync(this.cheetahDirectory);
      mkdirSync(`${this.cheetahDirectory}/.backup`);
    } catch (error) {}
  }
  backup() {
    return backupFiles(this.cheetahDirectory);
  }

  update(key, value) {
    const update = updateFile(`${this.cheetahDirectory}/${key}.json`, value);
    if (Object.keys(this.cache).length < this.cacheSize) {
      this.cache[key] = update;
    } else {
      delete this.cache[Object.keys(this.cache).length - 1];
      this.cache[key] = value;
    }
    return update;
  }
  get(key) {
    if (this.cache[key]) {
      return this.cache[key];
    }
    return getFile(`${this.cheetahDirectory}/${key}.json`);
  }
  create(key) {
    return createFile(`${this.cheetahDirectory}/${key}.json`);
  }
  delete(key) {
    delete this.cache[key];
    unlinkSync(`${this.cheetahDirectory}/${key}.json`);
  }
  exists(key) {
    if (existsSync(`${this.cheetahDirectory}/${key}.json`)) {
      return true;
    }
    return false;
  }
}
