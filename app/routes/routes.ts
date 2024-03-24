import * as express from 'express';
import { getQrData, getSession, init } from '../whatsapp/whatsapp';
import { delay, } from '@whiskeysockets/baileys';
import { toBuffer } from 'qrcode';
import log from '../services/pretty-logger';
import * as fs from 'fs';
import { LoginController } from '../express/controller/Web/LoginController';
import { HomeController } from '../express/controller/Web/HomeController';
import { authenticateWEB } from '../express/middleware/authenticateWEB';
import { InitController } from '../express/controller/Web/InitController';

const router = express.Router();


router.get('/', authenticateWEB, InitController.initial);
router.get('/whatsapp', authenticateWEB, InitController.check);
router.get('/whatsapp/qr', authenticateWEB, InitController.qrCode);
router.get('/logging/whatsapp/log', authenticateWEB, InitController.keepAlive)

router.get('/beranda', authenticateWEB, HomeController.homePage);

router.get('/login', LoginController.loginPage)
router.post('/login', LoginController.loginAction);
// router.post('/login/api', LoginController.loginActinAPI)

//protected Route
export default router;   