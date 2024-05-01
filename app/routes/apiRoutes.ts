import * as express from 'express';
import { ApiServiceController } from '../express/controller/Api/ApiServiceController';
import { isAdmin } from '../express/middleware/isAdminWeb';


const apiRouter = express.Router();

apiRouter.post('/info/', ApiServiceController.info)
apiRouter.get('/info/detailwhatsapp', isAdmin, ApiServiceController.infoSessionWhatsapp);
apiRouter.post('/info/actionbuttonwhatsapp', isAdmin, ApiServiceController.actionButtonWhatsapp)

export default apiRouter;
