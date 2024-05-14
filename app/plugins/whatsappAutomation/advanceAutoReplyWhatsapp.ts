import { delay } from "@whiskeysockets/baileys";
import prisma from "../../database/prisma";
import { getSession } from "../../whatsapp/whatsapp"
import { jidToNormalNumber } from "../../utils/numberResolve";
import { detailJawa, randomJawa } from "../../utils/basaJawa";

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
    } else {
        return false;
    }


}