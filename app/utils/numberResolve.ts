import { system } from "../config/system";

export function numberResolve(jid) {
    const nomorTanpaAwalNol = jid.slice(1);
    return `${system.number}${nomorTanpaAwalNol}@s.whatsapp.net`;
}

export function jidToNormalNumber(jid: string) {
    const nomor1 = jid.split('@');
    const nomor = nomor1[0].slice(2);
    return `0${nomor}`;
}