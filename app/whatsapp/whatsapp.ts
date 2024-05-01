import { makeWASocket, useMultiFileAuthState, Browsers, BufferJSON, DisconnectReason, BaileysEventMap, SocketConfig, WASocket } from "@whiskeysockets/baileys";
import Logger, { pino } from 'pino';
import log, { writeLogtoDatabase } from "../services/pretty-logger";
import * as fs from 'fs';
import { Boom } from "@hapi/boom";
import { serializeMessage } from "../utils/chatSerialize";
import { secretKey } from "../config/server";
const session: Map<string, WASocket> = new Map();
let qrData = null;
let newLogin = false;
let retry = 0;

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
        browser: Browsers.ubuntu('coba'),
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
            const badSession = DisconnectReason.unavailableService == 503 ? dataWrite.connection = "badSession(STOP)" : "";
            const statusCode = (lastDisconnect.error as Boom)?.output.statusCode;
            console.log(statusCode);
            if (statusCode == 408 || statusCode == 428) {
                dataWrite.connection = "CONNLOST";
                writeLogtoDatabase("CONNLOST", "KONEKSI TERPUTUS, MEMULAI ULANG...");
                log.error("SYSTEM : CONNECTION LOST, RETRYING");
                if (retry >= 5) {
                    log.error("SYSTEM : CONNECTION LOST... 5 RETRY FAILED");
                    sock.end(null);

                } else {
                    setTimeout(() => { init(); retry++ }, 10000);
                    retry = 0;
                }
            }
            if (statusCode == 515) {
                dataWrite.connection = "RESTART";
                writeLogtoDatabase("RESTART", "MERESTERTART KONEKSI...");
                log.error("SYSTEM : BUTUH RESTART, MERESTART, RESTARTING");
                setTimeout(() => init(), 1000);
            }

            if (statusCode == 401) {
                writeLogtoDatabase("LOGOUT", "KELUAR... MENGHAPUS KREDENSIAL DAN SESI");
                log.error("SYSTEM : KELUAR, LOG OUT: DELETING CREDENTIALS");
                dataWrite.connection = "LOGOUT"
                return setTimeout(() => {
                    fs.rm('app/whatsapp/session', { recursive: true, force: true }, (err) => {
                        if (err) {
                            log.error("SYSTEM: FAILED DELETE CREDENTIALS");
                            writeLogtoDatabase("LOGOUT", "GAGAL KELUAR SESI... BUG MAYBE");
                        } else {
                            writeLogtoDatabase("LOGOUT", "BERHASIL HAPUS KREDENSIAL DAN KONEKSI WHATSAPP DIPUTUS");
                            log.info("SYSTEM: CREDENTIALS DELETED. SYSTEM WHATSAPP CLOSED!!!");
                            setTimeout(() => sock.end(null), 2000);
                        }
                    })
                }, 4000)
            }

            if (DisconnectReason.unavailableService == 503) {
                dataWrite.connection = "BADSESSION";
                writeLogtoDatabase("DISCONNECT", "KONEKSI TERPUTUS. (Jangan Khawatir BadSession, itu normal:))");
                log.error('SYSTEM: CONNECTION STOPPED!!! BAD SESSION(Dont Worry this info)');
            }

            // console.log("INI DARI INFO SYSTEM", statusCode);
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
            dataWrite.connection = "OPEN";
            const writeLog = writeLogtoDatabase("OPEN", "KONEKSI TERBUKA... DAPAT DIGUNAKAN");
            log.info("SYSTEM : CONNECTION OPEN, GOOD LUCK : ) ");
        } else if (connection === 'connecting') {
            dataWrite.connection = "CONNECTING";
            const writeLog = writeLogtoDatabase("CONNECTING", "MENGUBUNGKAN...");
            log.warn("SYSTEM : CONNECTING, PLEASE WAIT : ) ");
        }

    });
    sock.ev.on('messages.upsert', ({ messages }) => {
        serializeMessage(messages);
    });
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

export async function infoSessionDetailWhatsapp() {
    const session = getSession('admin');
    const user = session.user;
    return user;
}