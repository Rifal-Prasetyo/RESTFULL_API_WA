import { makeWASocket, useMultiFileAuthState, Browsers, BufferJSON, DisconnectReason, BaileysEventMap, SocketConfig, WASocket } from "@whiskeysockets/baileys";
import Logger, { pino } from 'pino';
import log from "../services/pretty-logger";
import * as fs from 'fs';
import { Boom } from "@hapi/boom";
const session: Map<string, WASocket> = new Map();
let qrData = null;
let newLogin = false;

let dataWrite = {
    connection: null,
    qrCode: null,
    isNewLogin: "no"
}
export async function init() {
    const { state, saveCreds } = await useMultiFileAuthState('app/whatsapp/session');
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        browser: Browsers.macOS('coba'),
        syncFullHistory: true,
        logger: Logger({ level: 'silent' })
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, isNewLogin, qr } = update;
        if (qr) {
            qrData = qr
            newLogin = isNewLogin
        }
        if (isNewLogin) {
            dataWrite.isNewLogin = "yes"
        }
        dataWrite.qrCode = qr;
        if (connection === 'close') {
            const connectionLost = DisconnectReason.connectionLost == 408 ? true : false;
            const logout = DisconnectReason.loggedOut == 401 ? dataWrite.connection = "logout" : "";
            const connLost = DisconnectReason.connectionLost == 408 ? dataWrite.connection = "conLost" : "";
            const connClose = DisconnectReason.connectionClosed == 428 ? dataWrite.connection = "connClode" : "";
            const badSession = DisconnectReason.badSession == 500 ? dataWrite.connection = "badSession" : "";
            const statusCode = (lastDisconnect.error as Boom)?.output.statusCode;

            if (statusCode == 408 || statusCode == 428) {
                log.error("SYSTEM : CONNECTION LOST, RETRYING");
                setTimeout(() => init(), 10000);
            }
            if (statusCode == 515) {
                log.error("SYSTEM : BUTUH RESTART, MERESTART, RESTARTING");
                setTimeout(() => init(), 1000);
            }

            if (statusCode == 401) {
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

            console.log("INI DARI INFO SYSTEM", statusCode);
            // console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            // if (connLost) {
            //     log.error("SYSTEM : KELUAR, LOG OUT: DELETING CREDENTIALS");
            //     return setTimeout(() => {
            //         fs.rm('app/whatsapp/session', { recursive: true, force: true }, (err) => {
            //             if (err) {
            //                 log.error("SYSTEM: FAILED DELETE CREDENTIALS");
            //             } else {
            //                 log.info("SYSTEM: CREDENTIALS DELETED RETRYING");
            //                 setTimeout(() => init(), 2000);
            //             }
            //         })
            //     }, 4000)
            // }


        } else if (connection === 'open') {
            dataWrite.connection = "open";
            log.info("SYSTEM : CONNECTION OPEN, GOOD LUCK : ) ");
        } else if (connection === 'connecting') {
            dataWrite.connection = "connecting";
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

export async function stateWA() {
    return dataWrite;
}