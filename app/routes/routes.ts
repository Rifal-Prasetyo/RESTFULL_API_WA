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
import { RegisterController } from '../express/controller/Web/RegisterController';
import authButNotVerified from '../express/middleware/authButNotVerified';
import { guest } from '../express/middleware/guest';
import { ApiServiceController } from '../express/controller/Api/ApiServiceController';
import { upload } from '../utils/fileUpload';
import { AdminController } from '../express/controller/Web/AdminController';
import { CobaController } from '../express/controller/Web/CobaController';
import { FeatureController } from '../express/controller/Web/FeatureController';
import { FeatureBasaJawaController } from '../express/controller/Web/FeatureBasaJawaController';
import { PublicController } from '../express/controller/Web/PublicController';
import authButTOS from '../express/middleware/authButTOS';

const router = express.Router();
const validator = new ApiValidator();

// route for admin
router.get('/', isAdmin, InitController.initial); // WEB
router.get('/whatsapp', isAdmin, InitController.check); // API
router.get('/whatsapp/qr', isAdmin, InitController.qrCode); // API
router.get('/logging/whatsapp/log', isAdmin, InitController.keepAlive); // API STREAN


router.get('/manage/user', isAdmin, AdminController.manageUserPage); // Manage User
router.get('/manage/user/detail/:id', isAdmin, AdminController.detailUser);
router.get('/manage/user/edit/:id', isAdmin, AdminController.editUserPage);
router.post('/manage/user/edit/:id', isAdmin, upload.single('image'), AdminController.editUserAction);
router.get('/manage/user/delete/:id', isAdmin, AdminController.deleteUserPage);
router.post('/manage/user/delete/:id', isAdmin, AdminController.deleteUserAction);
router.get('/manage/user/verif/:id', isAdmin, AdminController.verifUserPage);
router.post('/manage/user/verif/:id', isAdmin, AdminController.verifUserAction);

router.get('/manage/announcement', isAdmin, AdminController.announcementPage);
router.get('/manage/announcement/create', isAdmin, AdminController.announcementCreatePage);
router.post('/manage/announcement/create', isAdmin, AdminController.announcementCreateAction);
router.get('/manage/announcement/delete/:id', isAdmin, AdminController.announcementDeleteAction);
router.get('/manage/announcement/hide/:id', isAdmin, AdminController.announcementHidePage);
router.post('/manage/announcement/hide/:id', isAdmin, AdminController.announcementHideAction);
router.get('/manage/whatsapp', isAdmin, AdminController.waManagePage);


// route for Authenticate USER
router.get('/home', authenticateWEB, HomeController.homePage);
router.get('/docs', authenticateWEB, HomeController.docsPage);
router.get('/randomApi', authenticateWEB, QrCodeController.qrRandom); // API
router.get('/profile', authenticateWEB, HomeController.infoProfile);
router.post('/profile/update', authenticateWEB, HomeController.updateProfileAction);
router.get('/history', HomeController.history);
router.get('/feature', authenticateWEB, FeatureController.featurePage);

// ROUTE FEATURE  BASA JAWA
router.get('/feature/basajawa', authenticateWEB, FeatureController.basaJawaPage);
router.get('/feature/basajawa/detail/:ukara', authenticateWEB, FeatureBasaJawaController.detailJawa);


// PUBLIC ROUTE
router.get('/login', guest, LoginController.loginPage);
router.post('/login', LoginController.loginAction);
router.get('/register', RegisterController.registerPage);
router.post('/register/action', upload.single('image'), validator.registerSerialize(), RegisterController.registerAction);
router.get('/wait', authButNotVerified, HomeController.waitUntilAdminVerify);
router.get('/tos', authButTOS, PublicController.tosPage);
router.post('/tos', authButTOS, PublicController.tosAction)
// router.post('/login/api', LoginController.loginActinAPI)

// API Send Message
router.post('/whatsapp/sendmessage', validator.sendMessage(), MessageWAController.sendMessage);
router.get('/whatsapp/sendimage', validator.sendMedia(), MessageWAController.sendMedia);

// API Information
router.get('/whatsapp/info', authenticateWEB, HomeController.infouser)
router.get('/logout', authenticateWEB, LoginController.logout);
router.post('/webhook', CobaController.saweria);

router.get('/end', CobaController.end);
//protected Route
export default router;   