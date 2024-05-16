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
}