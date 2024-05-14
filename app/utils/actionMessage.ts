import { delay } from "@whiskeysockets/baileys";
import prisma from "../database/prisma";
import { getSession } from "../whatsapp/whatsapp"
import { jidToNormalNumber, numberResolve } from "./numberResolve";
import { advanceAutoReplyWhatsapp } from "../plugins/whatsappAutomation/advanceAutoReplyWhatsapp";

interface DataMessage {

    name: string,
    type: string,
    number: string,
    message: string,
    group?: string


}
export async function actionMessage(data: DataMessage) {
    if (data.message.startsWith('/reg')) {
        const session = getSession('admin');
        const numbeReg = data.message.substring(5);
        try {
            const find = await prisma.user.findFirst({
                where: {
                    noWa: numbeReg
                }
            });
            const verify = await prisma.user.update({
                where: {
                    id: find.id,
                    noWa: find.noWa
                },
                data: {
                    isVerified: 1
                }
            });
            await session.sendMessage(data.number, { text: `User dengan nama ${verify.name} | ${verify.name_project} Berhasil Verifikasi. Sekarang sudah bisa memakai Layanan` });
            await delay(3000);
            await session.sendMessage(numberResolve(numbeReg), { text: "Anda sudah diverifikasi oleh owner. sekarang anda sudah bisa memakai layanan WhatsappQue\nhttps://waque.rifalkom.my.id" });
        } catch (err) {
            await session.sendMessage(data.number, { text: `Periksa kembali format yang dipakai` });
        }
    } else if (data.message.startsWith('/capt')) {
        const session = getSession('admin');
        const number = jidToNormalNumber(data.number);
        const user = await prisma.user.findFirst({
            where: {
                noWa: number
            }
        });

        if (data?.group && user) {
            const groupMetadata = await session.groupMetadata(data.group);
            const nameGroup = groupMetadata.subject;
            const date = new Date;
            let msg = ``;
            msg += `halo ${user.name}\n`
            msg += `Berikut Informasi singkat Group:\n\n`;
            msg += `Nama: ${nameGroup}\n`;
            msg += `idGroup: ${data.group}\n`;
            msg += `ID Group digunakan untuk mengirim pesan ke Grub\n\n`;
            msg += `Selengkapnya di Docs WhatsappQue\n`;
            msg += `WhatsappQue | M RIfal Prasetyo | @${date.getFullYear()}`;
            try {
                await session.sendMessage(data.number, { text: msg });
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('gasido');
            return false;
        }
    } else {
        await advanceAutoReplyWhatsapp(data);
    }
}