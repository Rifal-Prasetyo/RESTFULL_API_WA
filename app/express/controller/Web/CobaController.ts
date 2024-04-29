import { Request, Response } from "express";
import { getSession } from "../../../whatsapp/whatsapp";
import log from "../../../services/pretty-logger";
import { InitController } from "./InitController";
export class CobaController {
    public static async saweria(req: Request, res: Response) {
        console.log(await req.body);
    }


    public static async end(req: Request, res: Response) {
        const session = getSession('admin');
        try {
            session.end(new Error("gagal cok"));
            res.send({ berhasil: false });
        } catch (e) {
            InitController.isRunning = false;
            log.error('ywdh');
            res.send({ berhasil: true });
        }

    }


}