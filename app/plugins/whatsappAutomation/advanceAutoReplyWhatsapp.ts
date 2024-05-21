import { delay, downloadMediaMessage } from "@whiskeysockets/baileys";
import prisma from "../../database/prisma";
import { getSession } from "../../whatsapp/whatsapp"
import { jidToNormalNumber, numberResolve } from "../../utils/numberResolve";
import { detailJawa, randomJawa } from "../../utils/basaJawa";
import { linkTT } from "./utils/tiktokDownloader";
import instagramDownloader from "./utils/instagramDownloader";
import * as fs from 'fs';
import { owner } from "../../config/owner";
import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter' // ES6
import { internal } from "@hapi/boom";
import { getRawMessage } from "../../utils/chatSerialize";

interface DataMessage {
    name: string,
    type: string,
    number: string,
    message: string,
    group?: string
}

export async function advanceAutoReplyWhatsapp(data: DataMessage) {
    const session = getSession('admin');
    const number = jidToNormalNumber(data.number);
    if (data.message.startsWith('/basa')) {
        const ukara = data.message.substring(6).toLowerCase();
        const user = await prisma.user.findFirst({
            where: {
                noWa: number
            }
        });
        if (user) {
            const result = await detailJawa(ukara);
            if (result.data.status) {

                let msg = `*BASA JAWA KAMUS*\n\n`;
                msg += `Kasil Saking ukara ${ukara}\n`;
                msg += `*${result.data.name.toUpperCase()}*\n`;
                msg += `${result.data.description}\n\n`;
                msg += `Tipe Ukara`;
                result.data.types.forEach(ukara => msg += ukara);
                await session.sendPresenceUpdate('composing');
                await delay(1000);
                await session.sendMessage(data.number, { text: msg })
            } else {
                await session.sendPresenceUpdate('composing');
                await delay(1000);
                await session.sendMessage(data.number, { text: `Ukara ${ukara} mboten wonten` });
            }
        } else {
            return false;
        }
    } else if (data.message.startsWith('/randombasa')) {
        const result = await randomJawa();
        if (result.status) {
            let msg = `*BASA JAWA KAMUS*\n\n`;
            msg += `Ukara kang Acak: \n`
            result.data.forEach(ukara => msg += ukara + '\n');
            msg += `\nKangge mangertosi detail ukara random kang kasebut ing duwur panjenengan saget input ten Whatsapp */basa [ukara]*`;
            await session.sendPresenceUpdate('composing');
            await delay(1000);
            await session.sendMessage(data.number, { text: msg });
        }
        /** BOT WHATSAPP BRANCH  
         * Penggabungan dari bot WA sebelumnya
        */
    } else if (data.message.startsWith('/tt')) {
        const session = getSession('admin');
        await session.sendPresenceUpdate("composing", data.number);
        await delay(2000);
        await session.sendMessage(data.number, { text: 'Mengunduh Video Tiktok... Mohon tunggu' });
        const link_tt = data.message.substring(4);
        const getInfoTIktok = await linkTT(link_tt);
        if (getInfoTIktok.status == 'success') {
            await session.sendMessage(
                data.number,
                {
                    video: { url: getInfoTIktok.video },
                    caption: getInfoTIktok.description,
                    gifPlayback: false
                }
            )
        } else {
            await session.sendPresenceUpdate("composing", data.number);
            await delay(2000);
            await session.sendMessage(data.number, { text: getInfoTIktok.message });
        }

    } else if (data.message.startsWith('/ig')) {
        const session = getSession('admin');
        await session.sendPresenceUpdate("composing", data.number);
        await delay(2000);
        await session.sendMessage(data.number, { text: 'Mengunduh Video Instagram... Mohon tunggu' });
        const link_ig = data.message.substring(4);
        const getIgInfo = await instagramDownloader(link_ig);
        if (getIgInfo.status == 'success') {
            await session.sendMessage(
                data.number,
                {
                    video: { url: getIgInfo.link_video },
                    caption: getIgInfo.link_user,
                    gifPlayback: false
                }
            )
        } else {
            await session.sendPresenceUpdate("composing", data.number);
            await delay(2000);
            await session.sendMessage(data.number, { text: 'GAGAL MENGUNDUH...' })
        }

    } else if (data.message.startsWith('/menu')) {
        const session = getSession('admin');
        const name_user = data.name;
        const date = new Date();
        const message = `Halo ${name_user}, Berikut adalah perintah yang bisa dilakukan oleh bot\n===========\n- *Buat Stiker*\nMasukkan gambar dengan diberi   caption "/s" di gambarnya\n- *Download Video Tiktok*\n/tt [link_tiktok]\nContoh: /tt https://vt.tiktok.com/blabla/blablabala\n\n- *Download Video Reels Instagram*\n/ig [link_ig]\nContoh: /ig https://ig.com/blabalabala\n============\nDisclaimer masukkan perintah /tos\n============\nRifal Bot V3.4 ${date.getFullYear()}`;
        await session.sendPresenceUpdate("composing", data.number);
        await delay(1000);
        await session.sendMessage(data.number,
            {
                image: fs.readFileSync("app/plugins/whatsappAutomation/media/welcome.png"),
                caption: message,
                gifPlayback: false
            })
    } else if (data.message.startsWith('/tos')) {
        const session = getSession('admin');
        const message = `
    *KETENTUAN MEMAKAI BOT*\n\n1. Admin *TIDAK BERTANGGUNG JAWAB* terhadap generate Stiker yang dihasilkan user. semua Stiker yang dibuat User merupakan tanggung jawab user itu sendiri\n2. Mohon Gunakan seperlunya karena anda memakai layanan ini *"GRATIS!!!"*.`;
        await session.sendPresenceUpdate("composing", data.number);
        await delay(2000);
        await session.sendMessage(data.number, { text: message });
    } else if (data.message.startsWith('!tagsemua')) {
        const session = getSession('admin');
        if (numberResolve(data.number) == owner.noHp && data.group ? data.group : false) {
            const metadata = await session.groupMetadata(data.group);
            let teks = `*Halo Semua | ${metadata.subject}*\n`;
            let men = [];
            for (let mem of metadata.participants) {
                teks += `@${mem.id.split('@')[0]}\n`;
                men.push(mem.id);

            }
            await session.sendPresenceUpdate("composing", data.group);
            await delay(2000);
            session.sendMessage(data.group, { text: `${teks}`, mentions: men })
        } else {
            await session.sendPresenceUpdate("composing", data.number);
            await delay(2000);
            session.sendMessage(data.number, { text: 'Kamu tak punya hak melakukan tag ke semua member!!! *RIFAL BOT WARNING*' });
        }
    } else if (data.message.startsWith('/s')) {
        const session = getSession('admin');
        // statement jika caption gambar ada /s akan dijadikan stiker
        const rawMessage = await getRawMessage();
        const buffer = await downloadMediaMessage(rawMessage, 'buffer', {}, {
            reuploadRequest: session.updateMediaMessage,
            logger: undefined
        });
        const sticker = new Sticker(buffer as any, {
            pack: 'rizal_bot', // The pack name
            author: 'atmin', // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ['🎉'], // The sticker category
            quality: 50, // The quality of the output file
        });

        // const bufferstiker = await sticker.toBuffer() // convert to buffer
        await session.sendPresenceUpdate("composing", data.number);
        await delay(2000);
        await session.sendMessage(data.number, { text: `Bentar ${data.name}, sedang di Proses nih` });
        await delay(2000);
        await session.sendPresenceUpdate("available", data.number);
        await session.sendMessage(data.number, await sticker.toMessage());
    } else {
        return false;
    }


}