import { NextFunction, Request, Response } from "express"
import prisma from "../../database/prisma"
export default async function authButNotVerified(req: Request, res: Response, next: NextFunction) {
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
        if (user && user.isVerified == 1 && user.isTermsofService == 1) {
            return res.redirect('/home')
        } else if (user && user.isTermsofService == 0) {
            return res.redirect('/tos');
        } else {
            return next();
        }

    } else {
        res.redirect('/login');
    }
}