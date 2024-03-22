import * as express from 'express';
import { getQrData, getSession, init } from '../whatsapp/whatsapp';
import { delay,  } from '@whiskeysockets/baileys';
import {toBuffer} from 'qrcode';
import log from '../services/pretty-logger';
import * as fs from 'fs';

const router = express.Router();

let isRunning = false;
router.get('/', async(req, res) => {
    // res.send({
    //     'code': 'success'
    // });
    res.render('index');
})
router.get('/whatsapp', async (req, res) => {
    
    if(isRunning) {
        log.info("ACCESS FROM BROWSER : WA HAS RUNNING");
        const imageData = fs.readFileSync('public/img/profile.png');
            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
            res.end(imageData);
       
    } else {
        await init();
        await delay(5000)
        const qrCode =  await getQrData();
        if(qrCode.qr) {  
            res.end(await toBuffer(qrCode.qr));
            log.info("ACCESS FROM BROWSER : WA QR CODE");
        } else {
            log.error("ACCESS FROM BROWSER : WA OLD USER");
            const imageData = fs.readFileSync('public/img/profile.png');
            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageData.length });
            res.end(imageData);
        }
    }
    isRunning = true;
    
});

export default router;   