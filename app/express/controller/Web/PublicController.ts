import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { owner } from "../../../config/owner";
import * as fs from 'node:fs';
import { WhatsappAction } from "../../../utils/WhatsappAction";
import { numberResolve } from "../../../utils/numberResolve";
import { getSession } from "../../../whatsapp/whatsapp";

const nameApp = process.env.NAME_APP;
export class PublicController {
    public static async tosPage(req: Request, res: Response) {
        res.render('tos/tos', {
            titlePage: `${nameApp} | Terms of Service`,
            message: req.flash('info'),
        });
    }
    public static async tosAction(req: Request, res: Response) {
        const getNomorWA = req.session.user;
        const gettingUser = await prisma.user.findFirst({
            where: {
                noWa: getNomorWA
            }
        });
        const update = await prisma.user.update({
            where: {
                id: gettingUser.id,
            },
            data: {
                isTermsofService: 1
            }
        });

        return res.redirect('/wait');


    }

    public static async landingPage(req: Request, res: Response) {
        res.render('landingPage', {
            titlePage: `${nameApp} | Terms of Service`,
            message: req.flash('info'),
        });
    }
}