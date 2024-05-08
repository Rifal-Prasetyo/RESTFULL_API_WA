import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { stateWA } from "../../../whatsapp/whatsapp";
import hashing from "../../../services/hashPassword";
import { owner } from "../../../config/owner";
const nameApp = process.env.NAME_APP;

export class FeatureController {
    public static async featurePage(req: Request, res: Response) {
        res.render('feature/feature', {
            titlePage: `${nameApp} | Fitur Lain `,
            message: req.flash('info'),
        })
    }

    public static async basaJawaPage(req: Request, res: Response) {
        res.render('feature/basaJawa/basaJawaPage', {
            titlePage: `${nameApp} | Basa Jawa `,
            message: req.flash('info'),
        })
    }

}