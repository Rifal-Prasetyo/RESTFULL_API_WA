import { Request, Response } from "express";
const nameApp = process.env.NAME_APP;
import { body, validationResult } from "express-validator";
import crypto from 'crypto'
import prisma from "../../../database/prisma";
import { getSession } from "../../../whatsapp/whatsapp";
import { numberResolve } from "../../../utils/numberResolve";
import { owner } from "../../../config/owner";
import hashing from "../../../services/hashPassword";


export class RegisterController {

    public static async registerPage(req: Request, res: Response) {
        res.render('register/register', {
            titlePage: `${nameApp} | Register`,
            alert: false,
            nameApp: nameApp,
            message: req.flash('info')
        })
    }

    public static async registerAction(req: Request, res: Response) {
        const session = getSession('admin');
        const {
            name, noWa, organization, name_project, address, note, password
        } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('info', 'Perhatikan Format yang ada');
            return res.redirect('/register');
        }
        try {
            await prisma.user.create({
                data: {
                    name: name,
                    organization: organization,
                    address: address,
                    noWa: noWa,
                    password: hashing(password),
                    note: note,
                    name_project: name_project,
                    time: new Date(),
                    api: {
                        create: {
                            api: crypto.randomBytes(32).toString('base64'),
                            totalUse: 1
                        }
                    }
                },
                include: {
                    api: true
                }
            });
            // req.session.regenerate((err) => {
            //     if (err) res.redirect('/register');
            //     // store to session

            //     req.session.user = noWa;
            //     req.session.key = password;
            //     // save session
            //     req.session.save((err) => {
            //         if (err) res.redirect('/register');
            //         res.redirect('/wait');
            //     })
            // });
            let message = ``;
            message += `*SESEORANG INGIN MENDAFTAR KE SISTEM ANDA*\n\n`;
            message += `Berikut data yang diinput pengguna\n`;
            message += `Nama           : ${name}\n`;
            message += `Organisasi     : ${organization}\n`;
            message += `Alamat         : ${address}\n`;
            message += `Nama Project   : ${name_project}\n`;
            message += `Catatan        : ${note}\n`;
            message += `Waktu          : ${new Date()}\n`;
            message += `================\n\n`;
            message += `Buka Whatsapp Pendaftar https://wa.me/${numberResolve(noWa)}\n`;
            message += `Verifikasi Daftar dengan balas dengan salin pesan ini`;

            await session.sendMessage(numberResolve(owner.noHp), { text: message });
            await session.sendMessage(numberResolve(owner.noHp), { text: `/verif ${noWa}` });
            req.session.user = noWa;
            req.session.key = password;
            return res.redirect('/wait');
        } catch (error) {
            console.log(error);
            req.flash('info', 'Kesalahan');
            return res.redirect('/register');
        }


    }
}