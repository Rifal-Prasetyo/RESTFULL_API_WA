import { Request, Response } from "express";

export class HomeController {
    public static async homePage(req: Request, res: Response) {
        res.send({
            coba: "yah"
        })
    }
}

