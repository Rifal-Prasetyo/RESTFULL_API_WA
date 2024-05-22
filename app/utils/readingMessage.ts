import { getSession } from "../whatsapp/whatsapp";
import { getRawMessage } from "./chatSerialize";

export async function readMessage() {
    const session = getSession('admin');
    const message = await getRawMessage();
    const key = {
        remoteJid: message.key.remoteJid,
        id: message.key.id, // id of the message you want to read
        participant: message.key?.participant // the ID of the user that sent the  message (undefined for individual chats)
    }
    // console.log('from reading message', key);
    await session.readMessages([key])
}