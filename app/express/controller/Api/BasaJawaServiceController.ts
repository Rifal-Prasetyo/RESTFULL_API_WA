
import { Request, Response } from "express";
import { randomJawa } from "../../../utils/basaJawa";

export class BasajawaServiceController {
    public static async randomUkara(req: Request, res: Response) {
        const getting = randomJawa();
        res.send(getting);
    }
}