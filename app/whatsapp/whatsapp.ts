import { makeWASocket, useMultiFileAuthState, Browsers, BufferJSON, DisconnectReason, BaileysEventMap, SocketConfig, WASocket } from "@whiskeysockets/baileys";
import Logger, { pino } from 'pino';
import log from "../services/pretty-logger";
import * as fs from 'fs';
const session: Map<string, WASocket> = new Map();
let qrData = null;
let newLogin = false;
export async function init() {
    const { state, saveCreds } = await useMultiFileAuthState('app/whatsapp/session');
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        browser: Browsers.windows('Apalah'),
        syncFullHistory: true,
        logger: Logger({ level: "info" })
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, isNewLogin, qr } = update;
        if (qr) {
            qrData = qr
            newLogin = isNewLogin
        }
        if (connection === 'close') {
            const connectionLost = DisconnectReason.connectionLost == 408 ? true : false;
            const loggedOut = DisconnectReason.loggedOut;
            // console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (loggedOut === 401) {
                log.error("SYSTEM : KELUAR, LOG OUT: DELETING CREDENTIALS");
                return setTimeout(() => {
                    fs.rm('app/whatsapp/session', { recursive: true, force: true }, (err) => {
                        if (err) {
                            log.error("SYSTEM: FAILED DELETE CREDENTIALS");
                        } else {
                            log.info("SYSTEM: CREDENTIALS DELETED RETRYING");
                            setTimeout(() => init(), 2000);
                        }
                    })
                }, 4000)
            }
            if (connectionLost) {
                log.error("SYSTEM : CONNECTION LOST, RETRYING");
                setTimeout(() => init(), 10000);
            }

        } else if (connection === 'open') {
            log.info("SYSTEM : CONNECTION OPEN, GOOD LUCK : ) ");
        } else if (connection === 'connecting') {
            log.warn("SYSTEM : CONNECTING, PLEASE WAIT : ) ");
        }

    })
    sock.ev.on('creds.update', saveCreds);
    session.set('admin', { ...sock, });

}

export function getSession(data: string) {
    return session.get(data);
}
export async function getQrData() {
    return {
        isNewLogin: newLogin,
        qr: qrData
    };
}