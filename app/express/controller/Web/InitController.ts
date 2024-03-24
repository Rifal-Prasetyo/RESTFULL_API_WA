import { Request, Response } from "express";
import { getQrData, init } from "../../../whatsapp/whatsapp";
import { delay } from "@whiskeysockets/baileys";
import { toBuffer } from "qrcode";
import * as fs from 'fs';
import log from "../../../services/pretty-logger";

// interface dataAble {
//     isRunning: boolean;
//     initial(): void;

// }

export class InitController {
    static isRunning = false;
    public static async initial(req: Request, res: Response) {

        if (InitController.isRunning) {

            let dataText = {
                title: "Anda sudah Login",
                pr: 'Selamat menggunakan layanan Whatsapp API Rifal'
            };
            res.render('index', {
                title: dataText.title,
                pr: dataText.pr
            });
        } else {
            let dataText = {
                title: "Login ke akun Whatsapp Anda",
                pr: 'Login untuk dapat menggunkaan layanan ini'
            };
            res.render('index', {
                title: dataText.title,
                pr: dataText.pr
            });
        }
    }

    public static async check(req: Request, res: Response) {
        if (InitController.isRunning) {
            log.info("ACCESS FROM BROWSER : WA HAS RUNNING");
            const imageData = fs.readFileSync('public/img/profile.png');
            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
            res.end(imageData);

        } else {
            await init();
            await delay(5000)
            const qrCode = await getQrData();
            if (qrCode.qr) {
                res.end(await toBuffer(qrCode.qr));
                log.info("ACCESS FROM BROWSER : WA QR CODE");
            } else {
                log.error("ACCESS FROM BROWSER : WA OLD USER");
                const imageData = fs.readFileSync('public/img/profile.png');
                res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
                res.end(imageData);
            }
        }
        InitController.isRunning = true;
    }
}