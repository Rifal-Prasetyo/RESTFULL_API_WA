import { Request, Response } from "express";
import crypto from 'crypto'
import prisma from "../../../database/prisma";
export class QrCodeController {
    public static async qrRandom(req: Request, res: Response) {
        const cryptoResult = crypto.randomBytes(32).toString('base64');
        res.send({
            apiKey: cryptoResult
        })
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            }
        });
        const apiKey = await prisma.apiKey.update({
            where: {
                user_id: user.id
            },
            data: {
                api: cryptoResult
            }
        })
    }
}