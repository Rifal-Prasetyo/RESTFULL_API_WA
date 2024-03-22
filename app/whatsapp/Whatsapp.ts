import {makeWASocket, useMultiFileAuthState, Browsers, BufferJSON, DisconnectReason, BaileysEventMap} from "@whiskeysockets/baileys";
import Logger, { pino } from 'pino';

interface Session {
    name: string,
    session: () => Promise<BaileysEventMap>
}

const session = new Map();
export async function init() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        browser: Browsers.windows('Apalah'),
        syncFullHistory: true,
        logger: Logger({level: "silent"})
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, isNewLogin, qr } = update;
        if (connection === 'close') {
            const connectionLost = DisconnectReason.connectionLost == 408 ? true : false
            // console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (connectionLost) {
                init()
                console.log("connection Lost");
            }
        } else if (connection === 'open') {
            console.log("open")
        } else if (connection === 'connecting') {
            console.log("connecting")
        }
    })
    sock.ev.on('creds.update', saveCreds);
    session.set('admin', { ...sock, });
    
}

export function getSession(data : string) {
    return session.get(data);
}