import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { owner } from "../../../config/owner";
import * as fs from 'node:fs';
import { WhatsappAction } from "../../../utils/WhatsappAction";
import { numberResolve } from "../../../utils/numberResolve";
import { getSession } from "../../../whatsapp/whatsapp";
import hashing from "../../../services/hashPassword";

const nameApp = process.env.NAME_APP;
export class AdminController {
    public static async manageUserPage(req: Request, res: Response) {
        const query = req.query.query ? req.query.query : "";
        let pageNumber = req.query.p ? req.query.p : 1;
        if (pageNumber == 0) pageNumber = 1;
        const pageSize = 10;
        let wherecondition = {};
        // set to session 
        req.session.query = query as string;
        req.session.page = pageNumber as unknown as number;
        if (query) {
            wherecondition = ''
        }
        const user = await prisma.user.findMany({
            select: {
                name: true,
                name_project: true,
                noWa: true,
                organization: true,
                image: true,
                id: true,
                isVerified: true
            },
            where: {
                OR: [
                    { name: { contains: "%" + query as string + "%" } },
                    { organization: { contains: "%" + query as string + "%" } }
                ],
            },
            skip: (pageNumber as unknown as number - 1) * pageSize,
            take: pageSize,
            orderBy: {
                id: 'desc'
            }
        });
        res.render('owner/userManage', {
            titlePage: `${nameApp} | Manage User`,
            users: user,
            search: req.session.query,
            page: req.session.page,
            message: req.flash('info'),
        });
    }

    public static async detailUser(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        let isHasData = null;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: getID
                },
                include: {
                    api: true
                }
            });

            if (user) {
                isHasData = true
            } else {
                isHasData = false
            }
            return res.render('owner/action/detailUser', {
                titlePage: `${nameApp} | ${user.name} | Detail User`,
                isHasData: isHasData,
                message: req.flash('info'),
                user: user
            })
        } catch (error) {
            console.log(error);
            return res.render('owner/action/detailUser', {
                titlePage: `${nameApp} | Edit User | ERROR`,
                isHasData: false,
                message: req.flash('info'),
                user: null
            })
        }
    }
    public static async editUserPage(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        let isHasData = null;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: getID
                }
            });

            if (!user && user?.noWa === owner.noHp) {
                isHasData = false
            } else {
                isHasData = true
            }
            return res.render('owner/action/editUser', {
                titlePage: `${nameApp} | ${user.name} | Edit User`,
                isHasData: isHasData,
                message: req.flash('info'),
                user: user
            })
        } catch (error) {
            console.log(error);
            return res.render('owner/action/editUser', {
                titlePage: `${nameApp} | Edit User | ERROR`,
                isHasData: false,
                message: req.flash('info'),
                user: null
            })
        }

    }
    public static async editUserAction(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        let fileName = req?.file?.filename
        if (!fileName) {
            fileName = req.body.oldPhoto
        } else {
            fs.unlink(`./public/img/profile-user/${req.body.oldPhoto}`, (err) => {
                if (err) {
                    return;
                }
            });
        };
        let data = {
            name: req.body.name,
            noWa: req.body.noWa,
            organization: req.body.organization,
            name_project: req.body.name_project,
            address: req.body.address,
            note: req.body.note,
            image: fileName
        }
        if (req.body.kataSandi) {
            data["password"] = hashing(req.body.kataSandi);
        };
        try {
            await prisma.user.update({
                where: {
                    id: getID,
                },
                data: data
            });

            // set Session
            req.flash('info', "Berhasil Update")
            return res.redirect('/manage/user')
        } catch (error) {
            console.log(error);
            req.flash('info', "Gagal Update, Periksa Kembali");
            return res.redirect('/manage/user');
        }
    }

    public static async deleteUserPage(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        const user = await prisma.user.findFirst({
            where: {
                id: getID
            }
        });
        res.render('owner/action/deleteUser', {
            titlePage: `${nameApp} | Delete User`,
            isHasData: false,
            message: req.flash('info'),
            user: user,
            idTarget: getID
        })
    }
    public static async deleteUserAction(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        try {
            await prisma.user.delete({
                where: {
                    id: getID
                }
            });

            req.flash('info', `Berhasil Terhapus`);
            return res.redirect('/manage/user');
        } catch (error) {
            req.flash('info', `Gagal Terhapus`);
            return res.redirect('/manage/user');
        }
    }

    public static async verifUserPage(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        const user = await prisma.user.findFirst({
            where: {
                id: getID
            }
        });
        if (user.isVerified === 1) {
            return res.redirect('/manage/user');
        } else {

            return res.render('owner/action/verifUser', {
                titlePage: `${nameApp} | Verifikasi User`,
                isHasData: false,
                message: req.flash('info'),
                user: user,
                idTarget: getID
            })
        }

    }
    public static async verifUserAction(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        const wAction = new WhatsappAction();
        try {
            const user = await prisma.user.update({
                where: {
                    id: getID
                },
                data: {
                    isVerified: 1
                }

            });
            if (user.isVerified === 1) {
                throw new Error("YAh dia pacaran wkwkwk");
            }
            await wAction.sendMessage(user.noWa, "PERSONAL", "Anda sudah diverifikasi Owner WhatsappQue, sekarang Anda dapat menggunakan layanan WhatsappQue...");

            req.flash('info', `Berhasil Verifikasi`);
            return res.redirect('/manage/user');
        } catch (error) {
            req.flash('info', `Gagal Verifikasi`);
            return res.redirect('/manage/user');
        }
    }
    public static async announcementPage(req: Request, res: Response) {
        const announcement = await prisma.announcements.findMany({
            take: 10,
            skip: 0,
            orderBy: {
                id: 'desc'
            }
        })

        return res.render('owner/ancManage', {
            titlePage: `${nameApp} | Manage Announcement`,
            announcements: announcement,
            message: req.flash('info'),
        })
    }
    public static async announcementCreatePage(req: Request, res: Response) {
        return res.render('owner/ancAction/createAnc', {
            titlePage: `${nameApp} | Make Announcement`,
            message: req.flash('info'),

        })

    }
    public static async announcementCreateAction(req: Request, res: Response) {
        const bodyAnc = req.body.isiPengumuman;
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            },
            select: {
                id: true
            }
        });
        const ancOld = await prisma.announcements.findMany({
            take: 1,
            skip: 0,
            orderBy: {
                id: 'desc'
            }
        });
        if (ancOld[0]?.isShow) {
            await prisma.announcements.update({
                where: {
                    id: ancOld[0].id,
                },
                data: {
                    isShow: 0
                }
            })
        }
        const newAnc = await prisma.announcements.create({
            data: {
                user_id: user.id,
                body: bodyAnc,
                time: new Date(),
                isShow: 1
            }
        })

        req.flash('info', `Berhasil Menambah Pengumuman`);
        return res.redirect('/manage/announcement');
    }
    public static async announcementDeleteAction(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        try {
            const announcement = await prisma.announcements.delete({
                where: {
                    id: getID
                }
            })
            req.flash('info', `Berhasil Mengahapus Pengumuman`);
            return res.redirect('/manage/announcement');
        } catch (error) {
            req.flash('info', `Gagal Mengahapus Pengumuman`);
            return res.redirect('/manage/announcement');
        }
    }
    public static async announcementHidePage(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        try {
            res.render('owner/ancAction/HideAnc', {
                titlePage: `${nameApp} | S`,
                idTarget: getID,
                message: req.flash('info'),
            })
        } catch (error) {

        }
    }
    public static async announcementHideAction(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        try {
            await prisma.announcements.update({
                where: {
                    id: getID
                },
                data: {
                    isShow: 0
                }
            });
            req.flash('info', `Berhasil Menyembunyikan Pengumuman`);
            return res.redirect('/manage/announcement');
        } catch (error) {
            req.flash('info', `Gagal Menyembunyikan Pengumuman`);
            return res.redirect('/manage/announcement');
        }
    }

    // WHATSAPP MANAGE CONTROLLER
    public static async waManagePage(req: Request, res: Response) {
        const session = getSession('admin');
        res.render('owner/waManage', {
            titlePage: `${nameApp} | Manajemen Whatsapp`,
            message: req.flash('info'),
        })
    }
}