import { Request, Response } from "express";
import prisma from "../../../database/prisma";
const nameApp = process.env.NAME_APP;
export class HomeController {
    public static async homePage(req: Request, res: Response) {
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            include: {
                api: true
            }
        })
        res.render('home/home', {
            titlePage: `${nameApp} | Home`,
            alert: false,
            nameUser: user.name,
            apiKey: user.api.api
        })
    }
    public static async docsPage(req: Request, res: Response) {
        res.render('docs/docs', {
            titlePage: `${nameApp} | Docs API`,
            alert: false
        })
    }

}

