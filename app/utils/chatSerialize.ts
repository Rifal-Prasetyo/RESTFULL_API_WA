import { WAMessage } from "@whiskeysockets/baileys";
import { actionMessage } from "./actionMessage";
import log from "../services/pretty-logger";
import { sendDatabase } from "../services/storeDatabase";
import { readMessage } from "./readingMessage";

interface DataMessage {

    name: string,
    type: string,
    number: string,
    message: string,
    group?: string

}
let messageRaw: WAMessage = null;
export async function serializeMessage(messages: WAMessage[]) {
    let data: DataMessage = {
        name: "",
        type: "",
        number: "",
        message: ""
    };
    const m = messages[0];
    messageRaw = m;
    if (m.key.fromMe) return false;
    if (m.key.remoteJid === 'status@broadcast') return false;
    const messageType = Object.keys(m?.message)[0] ? Object.keys(m?.message)[0] : null;
    const text = messageType === "conversation" ? m.message.conversation
        : messageType === "extendedTextMessage" ? m.message.extendedTextMessage.text
            : messageType === "imageMessage" ? m.message.imageMessage.caption
                : messageType === "videoMessage" ? m.message.videoMessage.caption
                    : ""
    data['name'] = m.pushName;
    data['number'] = m.key.remoteJid;
    data['type'] = messageType;
    data['message'] = text;
    if (m.key.remoteJid.endsWith('@g.us')) {
        data['number'] = m.key.participant;
        data['group'] = m.key.remoteJid;
    }
    actionMessage(data);
    sendDatabase(data);
    readMessage();

}

export async function getRawMessage() {
    return messageRaw;
}