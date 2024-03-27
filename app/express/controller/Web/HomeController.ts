import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { stateWA } from "../../../whatsapp/whatsapp";
import hashing from "../../../services/hashPassword";
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
        let sessionMessage = req.session.message?.isMessage ? req.session.message.isMessage : false;
        let typeSessionInfo = req.session.message?.type ? req.session.message.type : false;
        let messageSessionInfo = req.session.message?.message ? req.session.message.message : false;
        res.render('home/home', {
            titlePage: `${nameApp} | Home`,
            alert: false,
            nameUser: user.name,
            apiKey: user.api.api,
            isMessage: sessionMessage,
            info_message: {
                type: typeSessionInfo,
                message: messageSessionInfo
            }
        })
        req.session.message = {
            isMessage: false,
            type: "",
            message: ""
        }
    }
    public static async docsPage(req: Request, res: Response) {
        res.render('docs/docs', {
            titlePage: `${nameApp} | Docs API`,
            alert: false
        })
    }
    public static async infouser(req: Request, res: Response) {
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            include: {
                api: true
            }
        });
        const stateWAInfo = await stateWA();
        res.send({
            info: stateWAInfo.connection,
            totalHitAPI: user.api.totalUse
        })

    }

    public static async infoProfile(req: Request, res: Response) {
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            select: {
                name: true,
                noWa: true,
            }
        });

        res.render('profile/profile', {
            titlePage: `${nameApp} | Profile`,
            user: user,
            error: false,
            message: ""
        });
    }
    public static async updateProfileAction(req: Request, res: Response) {
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            select: {
                name: true,
                noWa: true,
            }
        });
        try {
            await prisma.user.update({
                where: {
                    id: 1,
                    noWa: req.session.user
                },
                data: {
                    name: req.body.name,
                    noWa: req.body.noWa,
                    password: hashing(req.body.password)
                }
            });

            // set Session
            req.session.message = {
                isMessage: true,
                type: 'success_style',
                message: "Berhasil Update"
            };

            return res.redirect('/home')
        } catch (error) {
            return res.render('profile/profile', {
                titlePage: `${nameApp} | Profile`,
                user: user,
                error: true,
                message: "Cek Kemabali"
            });
        }
    }


}

