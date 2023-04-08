import { unlinkSync, mkdirSync, existsSync } from "fs";
import { backupFiles, getFile, createFile, updateFile } from "./fn.js";

export class cheetah {
  cheetahDirectory = "Cheetah";
  cacheSize = 100;
  cache = {};
  constructor(init) {
    const { Directory, cacheSize } = typeof init === "object" ? init : {};
    if (typeof Directory === "string") {
      this.cheetahDirectory = Directory;
    }
    if (typeof cacheSize === "number") {
      this.cacheSize = cacheSize;
    }
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
    updateFile(`${this.cheetahDirectory}/${key}.json`, value);
    if (Object.keys(this.cache).length < this.cacheSize) {
      if (this.cache[key]) {
        Object.assign(this.cache[key], value);
      } else {
        this.cache[key] = value;
      }
    } else {
      delete this.cache[Object.keys(this.cache).length - 1];
      this.cache[key] = value;
    }
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
