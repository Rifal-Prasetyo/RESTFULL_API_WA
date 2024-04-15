import { system } from "../config/system";
import { getSession } from "../whatsapp/whatsapp";

type TypeMessage = 'GROUP' | 'PERSONAL';
export class WhatsappAction {
    async sendMessage(jid: string, type: TypeMessage, message: string) {
        let target = "";
        switch (type) {
            case "PERSONAL":
                const nomorTanpaAwalNol = jid.slice(1);
                target = `${system.number}${nomorTanpaAwalNol}@s.whatsapp.net`;
                break;
            case "GROUP":
                target = jid
                break;

            default:
                break;
        }
        const session = getSession('admin');
        try {
            await session.sendMessage(target, { text: message });
            return {
                status: true,
                message: "Pesan Terkirim"
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: "Pesan gagal terkirim, jika berulang kali gagal. periksa alamat pengiriman atau laporkan admin"
            }
        }
    }
    async sendMedia(jid: string, type: string, media: string, data: any) {
        let target = "";
        switch (type) {
            case "PERSONAL":
                const nomorTanpaAwalNol = jid.slice(1);
                target = `${system.number}${nomorTanpaAwalNol}@s.whatsapp.net`;
                break;
            case "GROUP":
                target = jid
                break;

            default:
                break;
        }
        let messageContent: any = {
            caption: '',
            gifPlayback: false
        };
        messageContent[media] = { url: data.url };
        messageContent.caption = data.caption;
        const session = getSession('admin');
        try {
            await session.sendMessage(target, messageContent);
            return {
                status: true,
                message: "Media Terkirim"
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: "Media gagal terkirim, jika berulang kali gagal. periksa alamat pengiriman atau laporkan admin"
            }
        }
    }
}