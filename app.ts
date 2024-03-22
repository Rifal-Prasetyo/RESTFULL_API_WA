import express from 'express';
import server from './app/config/server';
import router from './app/routes/routes';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('*', router);



const listener = () => {
    console.log("SYSTEM AT PORT " + port );
}

const host = server.host || "0.0.0.0";
const port = server.port || 3000;
(async () => {
    app.listen(port, host, listener);
})();