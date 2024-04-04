import { WAMessage } from "@whiskeysockets/baileys";
import { actionMessage } from "./actionMessage";
interface DataMessage {

    name: string,
    type: string,
    number: string,
    message: string

}
export async function serializeMessage(messages: WAMessage[]) {
    let data: any = {};
    const m = messages[0];
    if (m.key.fromMe) return false;
    const messageType = Object.keys(m.message)[0];
    const text = messageType === "conversation" ? m.message.conversation
        : messageType === "extendedTextMessage" ? m.message.extendedTextMessage.text
            : messageType === "imageMessage" ? m.message.imageMessage.caption
                : messageType === "videoMessage" ? m.message.videoMessage.caption : ""

    data['name'] = m.pushName;
    data['number'] = m.key.remoteJid;
    data['type'] = Object.keys(m.message)[0];
    data['message'] = text;

    actionMessage(data);
}