import { Request, Response } from "express";
import { getQrData, init, getSession, stateWA } from "../../../whatsapp/whatsapp";
import { delay, DisconnectReason } from "@whiskeysockets/baileys";
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
                title: "Login ke akun Whatsapp Anda",
                pr: 'Login untuk dapat menggunkaan layanan ini'
            };
            res.render('index', {
                title: dataText.title,
                pr: dataText.pr
            });
        } else {
            await init();
            let dataText = {
                title: "Login ke akun Whatsapp Anda",
                pr: 'Login untuk dapat menggunkaan layanan ini'
            };
            res.render('index', {
                title: dataText.title,
                pr: dataText.pr
            });
        }
        InitController.isRunning = true;
    }

    public static async check(req: Request, res: Response) {
        if (InitController.isRunning) {
            log.info("ACCESS FROM BROWSER : WA HAS RUNNING");
            const imageData = fs.readFileSync('public/img/profile.png');
            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
            res.end(imageData);

        } else {

            // await delay(5000)
            // const qrCode = await getQrData();
            // if (qrCode.qr) {
            //     res.end(await toBuffer(qrCode.qr));
            //     log.info("ACCESS FROM BROWSER : WA QR CODE");
            // } else {
            //     log.error("ACCESS FROM BROWSER : WA OLD USER");
            //     const imageData = fs.readFileSync('public/img/profile.png');
            //     res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
            //     res.end(imageData);
            // }
        }
        InitController.isRunning = true;

    }
    public static async qrCode(req: Request, res: Response) {
        const qrCode = await getQrData();
        res.end(await toBuffer(qrCode.qr));
    }
    public static async keepAlive(req: Request, res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const intervalId = setInterval(async () => {
            // check Whatsapp Init
            // Kirim data setiap detik
            let dataWrite = await stateWA();
            res.write(`data: ${JSON.stringify(dataWrite)}\n\n`);
        }, 1000);

        // Handle jika klien terputus
        req.on('close', () => {
            clearInterval(intervalId);
        });
    }
}