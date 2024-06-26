import { Request, Response, NextFunction } from "express";
import prisma from "../../database/prisma";
import { owner } from "../../config/owner";
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        // bcrypt.compare(req.session.key, user.password, (err, result) => {
        //     if (result) {
        //         return next()
        //     } else {
        //         return next('route');
        //     }
        // })
        if (req.session.user == owner.noHp) {
            return next();
        } else {
            res.redirect('/login');
        }

    } else {
        res.redirect('/login');
    }
}