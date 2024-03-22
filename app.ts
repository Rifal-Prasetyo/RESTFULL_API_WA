import express from 'express';
import server from './app/config/server';
import router from './app/routes/routes';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import 'dotenv/config';
import * as path from 'path';
import { init } from './app/whatsapp/whatsapp';

const app = express();
app.use(express.json());
app.engine('.html', ejs.__express);
app.set('views', './app/views');
app.use(express.static('./public'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router);



const listener = () => {
    console.log("SYSTEM AT PORT " + port );
}

const host = server.host || "0.0.0.0";
const port = server.port || 3000;
(async () => {
    // await init();
    app.listen(port, host, listener);
})();