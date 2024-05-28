import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { stateWA } from "../../../whatsapp/whatsapp";
import hashing from "../../../services/hashPassword";
import { owner } from "../../../config/owner";
const nameApp = process.env.NAME_APP;

export class HomeController {
    public static async homePage(req: Request, res: Response) {
        let isOwner = null;
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            include: {
                api: true
            }
        })
        const nomorHp = "6" + owner.noHp.slice(1);
        if (owner.noHp == user.noWa) {
            isOwner = true
        } else {
            isOwner = false;
        }

        const announcement = await prisma.announcements.findFirst({
            where: {
                isShow: 1
            }
        });

        const userVerfied = await prisma.user.findFirst({
            where: {
                isVerified: 0
            }
        });

        res.render('home/home', {
            titlePage: `${nameApp} | Home`,
            alert: false,
            nameUser: user.name,
            apiKey: user.api.api,
            message: req.flash('info'),
            ownerNumber: nomorHp,
            isOwner: isOwner,
            userProfileImage: user.image,
            announcement: announcement,
            userVerfied: userVerfied
        })


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
                organization: true,
                name_project: true,
                address: true,
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
                id: true,
                name: true,
                noWa: true,
            }
        });
        try {
            await prisma.user.update({
                where: {
                    id: user.id,
                    noWa: req.session.user
                },
                data: {
                    name: req.body.name,
                    password: hashing(req.body.password)
                }
            });

            // set Session
            req.flash('info', "Berhasil Update")

            return res.redirect('/home')
        } catch (error) {
            req.flash('info', "Gagal Update, Periksa Kembali");
            return res.redirect('/profile');
        }
    }

    public static async waitUntilAdminVerify(req: Request, res: Response) {
        res.render('wait/wait', {
            titlePage: `${nameApp} | Waiting`,
            error: false,
            message: req.flash('info')
        })
    }
    public static async history(req: Request, res: Response) {
        const apiPush = await prisma.apiPush.findMany({
            include: {
                User_use: true
            },
            where: {
                User_use: {
                    noWa: req.session.user
                }
            },
            take: 10,
            skip: 0,
            orderBy: {
                id: 'desc'
            }
        });
        res.render('history/history', {
            titlePage: `${nameApp} | Histori`,
            error: false,
            message: req.flash('info'),
            data: apiPush
        });

    }
}

