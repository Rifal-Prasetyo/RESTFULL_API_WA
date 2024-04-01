import express from 'express';
import server, { secretKey } from './app/config/server';
import router from './app/routes/routes';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'express-flash';
import ejs from 'ejs';
import 'dotenv/config';
import * as path from 'path';
import { init } from './app/whatsapp/whatsapp';
import apiRouter from './app/routes/apiRoutes';

const app = express();
app.use(express.json());
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.engine('.html', ejs.__express);
app.set('views', './app/views');
app.use(express.static('./public'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
app.use('/api', apiRouter)



const listener = () => {
    console.log("SYSTEM AT PORT " + port);
}

const host = server.host || "0.0.0.0";
const port = server.port || 3000;
(async () => {
    // await init();
    app.listen(port, host, listener);
})();