# CheetahDB

<p align="center">
  <a  href="https://github.com/fridaycandour/CheetahDB">
    <img src="logo.gif" alt="Logo" width="190" height="100">
  </a>
</p>

CheetahDB is a JSON document Manager, with ACID complaint and backup recovery mechanism.

Fast & Durable key-JSON store for NodeJS

![Contributors](https://img.shields.io/github/contributors/fridaycandour/CheetahDB?color=dark-green) ![Issues](https://img.shields.io/github/issues/fridaycandour/CheetahDB) ![License](https://img.shields.io/github/license/fridaycandour/CheetahDB)
[![npm Version](https://img.shields.io/npm/v/CheetahDB.svg)](https://www.npmjs.com/package/CheetahDB)
[![License](https://img.shields.io/npm/l/CheetahDB.svg)](https://github.com/fridaycandour/CheetahDB/blob/next/LICENSE)
[![npm Downloads](https://img.shields.io/npm/dm/CheetahDB.svg)](https://www.npmjs.com/package/CheetahDB)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CheetahDB/CheetahDB.js/blob/next/contributing.md)![Forks](https://img.shields.io/github/forks/fridaycandour/CheetahDB?style=social) ![Stargazers](https://img.shields.io/github/stars/fridaycandour/CheetahDB?style=social)

CheetahDB works as a key-JSON store that provides ordered mapping from keys to string values.

Uses synchronous filesystem methods to exclusively perform append writes to disk, this puts the performance of CheetahDB near the theoretical maximum write performance for ACID compliant javascript databases.

- ACID Compliant with transaction support.
- Data is durable in the face of application or power failure.
- backup system

## Installation

```
npm i CheetahDB --save
```

## Usage

```ts
import { CheetahDB } from "CheetahDB";

const example = async () => {
  // setup database
  const db = new cheetah({});
  // create a record
  db.create("loop");
  // put a record
  db.update("loop", { index: "is love" });
  // get a record
  let rec = db.get("loop");
  console.log(rec);
  // backup the entire json files into backup.tar.gz
  db.backup();
  // deletes a record
  db.delete("loop");
};
example();
```

## API

The `CheetahDB` class accepts an object argument with the following properties:

### Object Properties

| Property  | Required | Type   | Details                                                 |
| --------- | -------- | ------ | ------------------------------------------------------- |
| Directory | false    | string | The folder to persist data into default to `CheetahDB`. |
| cacheSize | false    | number | Default is `100`.                                       |

## Class Methods

<details><summary>.create</summary>

#### .create(key: string): void

create a json file json file at the provided key.
return false if the files exists

```js
db.create("food recipes");
db.update("phones");
```

</details>

<details><summary>.update</summary>

#### .update(key: string, data: object): void

Puts a valid json javascript object into a json file at the provided key.

throws an error if it has'nt been created with .create()

```js
await db.update("food recipes", [{ name: "egg fries" }]);
await db.update("phones", { home: "0-567-000", office: "0-9-99876" });
```

</details>

<details><summary>.get</summary>

#### .get(key: string ): object

Used to object the value of a single key.

```js
const data = await db.get("phones");
console.log(data); //   { home: "0-567-000", office: "0-9-99876" }
```

</details>

<details><summary>.exists</summary>

#### .exists(key: string) => void): boolean

Checks to see if a single key exists.

```ts
const data = await db.exists("phones");
console.log(data); // true
```

</details>

<details><summary>.delete</summary>

#### .exists(key: string) => void): boolean

Checks to see if a single key exists.

```ts
await db.delete("phones");
```

</details>
 
<details><summary>.backup</summary>

#### .backup(): Promise\<void\>

creates a backup.tar.gz file at the root dir, containing all the json files, .

```ts
await db.backup();
```

</details>
 
# MIT License

Copyright (c) 2019 Friday Candour

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
` CheetahDB`
