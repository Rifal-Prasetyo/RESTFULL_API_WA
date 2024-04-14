import { Request, Response } from "express";
import 'dotenv/config';
import prisma from "../../../database/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from "../../../config/server";
import hashing from "../../../services/hashPassword";
const nameApp = process.env.NAME_APP;


export class LoginController {

    // display login Page
    public static async loginPage(req: Request, res: Response) {
        res.render('login/login', {
            nameApp: nameApp,
            titlePage: `${nameApp} | Login Ke Whatsapp API`,
            alert: false
        });
    }

    public static async loginAction(req: Request, res: Response) {
        const { password } = req.body
        const noWA: string = req.body.noWA;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    noWa: noWA
                }
            });

            if (!user) {
                return res.render('login/login', {
                    nameApp: nameApp,
                    titlePage: `${nameApp} | Login Ke Whatsapp API`,
                    alert: true,
                    message: "Username atau Sandi Kamu Salah"
                });

            } else {
                const validatePassword = bcrypt.compareSync(password, user.password);
                if (validatePassword) {

                    req.session.regenerate((err) => {
                        if (err) return res.redirect('/login');

                        // store to session

                        req.session.user = user.noWa;
                        req.session.key = user.password;


                        // save session
                        req.session.save((err) => {
                            if (err) return res.redirect('/login');
                            res.redirect('/home');

                        })
                    })
                } else {
                    return res.render('login/login', {
                        nameApp: nameApp,
                        titlePage: `${nameApp} | Login Ke Whatsapp API`,
                        alert: true,
                        message: "Username atau Sandi Kamu Salah"
                    });
                }
            }
        } catch (error) {
            res.redirect('/login');
        }
    }
    public static async loginActionAPI(req: Request, res: Response) {
        const { password } = req.body
        const noWA: string = req.body.noWA;
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
    public static async logout(req: Request, res: Response) {
        req.session.destroy(function () {
            res.redirect('/');
        });
    }
}