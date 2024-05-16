import { NextFunction, Request, Response } from "express"
import prisma from "../../database/prisma"
export default async function authButTOS(req: Request, res: Response, next: NextFunction) {
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
        if (user && user.isTermsofService == 1) {
            return res.redirect('/wait');
        } else if (user && user.isTermsofService == 1 && user.isVerified == 1) {
            return res.redirect('/home');
        } else {
            return next();
        }

    } else {
        res.redirect('/login');
    }
}