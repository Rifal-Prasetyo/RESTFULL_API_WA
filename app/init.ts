import { delay } from "@whiskeysockets/baileys";
import log from "./services/pretty-logger";

let i = 1;
let perulangan = 6;
async function init() {
    log.info("STARTING APPLICATION...");
    await delay(1500);
    for (i; i < perulangan; i++) {
        await delay(500);
        log.info("TASK " + i + " BERHASIL");
        check();
    }

}
function check() {
    if (i == perulangan - 1) {
        log.warning("YOUR APP STARTED SUCCESSFULLY!!!");
    }
    return true
}
init();