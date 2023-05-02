// @ts-ignore
import { createServer } from "http";
import cheetah from "../src/index.js";

const httpPort = 8000;
const cheetahR = new cheetah();
await cheetahR.create("foo");
let counter = 0;
//
createServer(handler).listen(httpPort, start_callback);
function handler(req, res) {
  setTimeout(() => {
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    cheetahR.update("foo", { counter });
    res.write(String(counter));
    counter += 1;`
    res.end();
    return;
  }, 50);
}
function start_callback() {
  console.log("Start HTTP on port " + httpPort);
}
