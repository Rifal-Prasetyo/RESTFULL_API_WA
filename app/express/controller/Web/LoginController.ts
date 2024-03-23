import { Request, Response } from "express";
import 'dotenv/config';
import prisma from "../../../database/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from "../../../config/server";
const nameApp = process.env.NAME_APP;


export class LoginController {

    // display login Page
    public static async loginPage(req: Request, res: Response) {
        res.render('login/login', {
            nameApp: nameApp,
            titlePage: `${nameApp} | Login Ke Whatsapp API`
        });
    }

    public static async loginAction(req: Request, res: Response) {
        const { password } = req.body
        const noWA: number = req.body.noWA;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    noWa: noWA
                }
            });
            if (!user) {
                return res.status(400).json({ message: 'Invalid phone number or password.' });
            }

            // check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid phone number or password.' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user.id }, secretKey);
            res.header('Authorization', token).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}