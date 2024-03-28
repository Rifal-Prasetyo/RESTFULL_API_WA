import { NextFunction, Request, Response } from "express"
import prisma from "../../database/prisma"
import * as bcrypt from 'bcrypt';
export async function guest(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        const user = await prisma.user.findFirst({
            where: {
                noWa: req.session.user
            }
        });
        // bcrypt.compare(req.session.key, user.password, (err, result) => {
        //     if (result) {
        //         return next()
        //     } else {
        //         return next('route');
        //     }
        // })
        if (user) {
            return res.redirect('/wait')
        }

    } else {
        return next();
    }

}