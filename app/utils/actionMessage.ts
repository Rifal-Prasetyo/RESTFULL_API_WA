import { delay } from "@whiskeysockets/baileys";
import prisma from "../database/prisma";
import { getSession } from "../whatsapp/whatsapp"
import { numberResolve } from "./numberResolve";

interface DataMessage {

    name: string,
    type: string,
    number: string,
    message: string

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
            await session.sendMessage(numberResolve(numbeReg), { text: "Anda sudah diverifikasi oleh owner. sekarang anda sudah bisa memakai layanan WhatsappQue" });
        } catch (err) {
            await session.sendMessage(data.number, { text: `Periksa kembali format yang dipakai` });
        }
    }
}