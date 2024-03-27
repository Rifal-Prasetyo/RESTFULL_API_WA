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
import { isAdmin } from '../express/middleware/isAdminWeb';
import { QrCodeController } from '../express/controller/Api/QrCodeController';
import { MessageWAController } from '../express/controller/Api/MessageWAController';
import { ApiValidator } from '../utils/ApiValidator';

const router = express.Router();
const validator = new ApiValidator();

// route for admin
router.get('/', isAdmin, InitController.initial); // WEB
router.get('/whatsapp', isAdmin, InitController.check); // API
router.get('/whatsapp/qr', isAdmin, InitController.qrCode); // API
router.get('/logging/whatsapp/log', isAdmin, InitController.keepAlive); // API STREAN

// route for Authenticate USER
router.get('/home', authenticateWEB, HomeController.homePage);
router.get('/docs', authenticateWEB, HomeController.docsPage);
router.get('/randomApi', authenticateWEB, QrCodeController.qrRandom); // API

router.get('/login', LoginController.loginPage);
router.post('/login', LoginController.loginAction);
// router.post('/login/api', LoginController.loginActinAPI)

// API Send Message
router.post('/whatsapp/sendmessage', validator.sendMessage(), MessageWAController.sendMessage);
router.get('/whatsapp/sendimage', validator.sendMedia(), MessageWAController.sendMedia);

router.get('/logout', authenticateWEB, LoginController.logout);


//protected Route
export default router;   