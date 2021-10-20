import * as fs from "fs";
import * as https from "https";
import server from "./server";

const HTTP_PORT = 4500;
const HTTPS_PORT = 3500;

server.listen(HTTP_PORT, () => {
  console.log("Express server listening on port " + HTTP_PORT);
});

/*https.createServer({
  key:fs.readFileSync('../security/evntmgt-dev-api-key.pem'),
  cert:fs.readFileSync('../security/evntmgt-dev-api-cert.pem'),
  passphrase: process.env.APP_KEY_PASS
},server).listen(HTTPS_PORT);*/

export default server;