import { Request, Response } from "express";
import prisma from "../../../database/prisma";

const nameApp = process.env.NAME_APP;
export class AdminController {
    public static async manageUserPage(req: Request, res: Response) {
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
            take: 10,
            skip: 0,
            orderBy: {
                id: 'desc'
            }
        })
        res.render('owner/userManage', {
            titlePage: `${nameApp} | Manage User`,
            users: user
        })
    }

    public static async detailUser(req: Request, res: Response) {
        const getID: number = parseInt(req.params.id);
        let isHasData = null;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: getID
                }
            });

            if (user) {
                isHasData = true
            } else {
                isHasData = false
            }
            return res.render('owner/action/detailUser', {
                titlePage: `${nameApp} | ${user.name} | Edit User`,
                isHasData: isHasData,
                user: user
            })
        } catch (error) {
            console.log(error);
            return res.render('owner/action/detailUser', {
                titlePage: `${nameApp} | Edit User | ERROR`,
                isHasData: false,
                user: null
            })
        }
    }
}