import * as express from 'express';
import { ApiServiceController } from '../express/controller/Api/ApiServiceController';


const apiRouter = express.Router();

apiRouter.post('/info/', ApiServiceController.info)
apiRouter.get('/info/detailwhatsapp', ApiServiceController.infoSessionWhatsapp);
apiRouter.post('/info/actionbuttonwhatsapp', ApiServiceController.actionButtonWhatsapp)

export default apiRouter;
