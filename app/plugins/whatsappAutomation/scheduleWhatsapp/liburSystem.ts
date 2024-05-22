import * as schedule from "node-schedule";
import prisma from "../../../database/prisma";
import { getSession } from "../../../whatsapp/whatsapp"
import { getRandomNumber } from "../../../utils/getRandomNumber";
import { delay } from "@whiskeysockets/baileys";
import log from "../../../services/pretty-logger";
// system libur nasional
const rule = new schedule.RecurrenceRule();
rule.hour = 3;
rule.min
rule.tz = 'Asia/Jakarta';
export const scheduleJob = async () => schedule.scheduleJob(rule, () => liburan());

function hapusAngkaNolDiDepan(variabel) {
    // Menghapus angka nol di depan variabel
    while (variabel.length > 1 && variabel[0] === '0') {
        variabel = variabel.slice(1);
    }
    return variabel;
}

// function check Libur
async function liburan() {

    const date = new Date();
    const userAwal = await prisma.contact.findMany();
    const offset = 7;
    date.setTime(date.getTime() + offset * 60 * 60 * 1000);
    const dateFormat = date.toISOString().split('T')[0];
    const splitter = dateFormat.split('-');
    const tanggalTanpaNol = hapusAngkaNolDiDepan(splitter[2]);
    const newDateFormat = `${splitter[0]}-${splitter[1]}-${tanggalTanpaNol}`;

    const userDataBaru = userAwal.filter((obj) => {
        const tipeNumber = obj.number.toLowerCase();
        return !tipeNumber.includes("status@broadcast") && !tipeNumber.endsWith("@g.us");
    });
    // get libur
    try {
        const session = await getSession('admin');
        const req = await fetch('https://api-harilibur.vercel.app/api');
        const res = await req.json();

        const hariLiburan = res.filter(hasLibur => hasLibur.holiday_date === newDateFormat);
        if (hariLiburan && hariLiburan[0]?.is_national_holiday) {
            let getHolidayName = hariLiburan[0].holiday_name;
            let getHolidaynational = hariLiburan[0].is_national_holiday;

            // lakukan pengiriman pesan
            for (let i = 0; i < userDataBaru.length; i++) {
                let msg = "";
                msg += "Halo " + userDataBaru[i].nameUser + ", ada informasi Liburan nih😁\n";
                msg += "Selamat Memperingati *" + getHolidayName + "* \n";
                msg += "===========\n";
                msg += "Manfaatkan Liburan untuk hal-hal yang bermanfaat dimanapun kapanpun.\n";
                msg += "RIFAL BOT"
                await delay(getRandomNumber(1000, 2500));
                await session.sendMessage(userDataBaru[i].number, { text: msg });
            }
        } else {
            return log.info('tidak ada hari libur');
        }
    } catch (error) {
        console.log(error);
        return log.info('error');
    }
}