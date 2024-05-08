import * as express from 'express';
import { ApiServiceController } from '../express/controller/Api/ApiServiceController';
import { isAdmin } from '../express/middleware/isAdminWeb';
import { BasajawaServiceController } from '../express/controller/Api/BasaJawaServiceController';


const apiRouter = express.Router();

apiRouter.post('/info/', ApiServiceController.info)
apiRouter.get('/info/detailwhatsapp', isAdmin, ApiServiceController.infoSessionWhatsapp);
apiRouter.post('/info/actionbuttonwhatsapp', isAdmin, ApiServiceController.actionButtonWhatsapp);

// route for NORMADA 
apiRouter.get('/feature/basajawa/populer', BasajawaServiceController.randomUkara);
apiRouter.get('/feature/basajawa/search/:ukara', BasajawaServiceController.searchJawa);
apiRouter.get('/feature/basajawa/tipe', BasajawaServiceController.tipeKata);
apiRouter.get('/feature/basajawa/detail/:ukara', BasajawaServiceController.detailJawa);
export default apiRouter;
