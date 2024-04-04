import * as express from 'express';
import { ApiServiceController } from '../express/controller/Api/ApiServiceController';


const apiRouter = express.Router();

apiRouter.post('/info/', ApiServiceController.info)

export default apiRouter;
