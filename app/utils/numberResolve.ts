import { system } from "../config/system";

export function numberResolve(jid) {
    const nomorTanpaAwalNol = jid.slice(1);
    return `${system.number}${nomorTanpaAwalNol}@s.whatsapp.net`;
}