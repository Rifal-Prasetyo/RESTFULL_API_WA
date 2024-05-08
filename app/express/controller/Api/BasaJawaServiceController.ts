
import { Request, Response } from "express";
import { detailJawa, randomJawa, searchJawa, tipeKata } from "../../../utils/basaJawa";

export class BasajawaServiceController {
    public static async randomUkara(req: Request, res: Response) {
        const getting = await randomJawa();
        res.send(getting);
    }
    public static async searchJawa(req: Request, res: Response) {
        const getting = await searchJawa(req.params.ukara, 1);
        res.send(getting);
    }
    public static async tipeKata(req: Request, res: Response) {
        const getting = await tipeKata();
        res.send(getting);
    }
    public static async detailJawa(req: Request, res: Response) {
        const getting = await detailJawa(req.params.ukara);
        res.send(getting);
    }

}