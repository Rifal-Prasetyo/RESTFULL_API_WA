import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { trimUndefined } from "@whiskeysockets/baileys";
import { isRequestAllowed } from "../../../utils/rateLimiter";

export class ApiServiceController {
    public static async info(req: Request, res: Response) {
        const api = req.body.api_key;
        const page = req.body.page ? req.body.page * 10 : 0;
        let data = [];
        if (!isRequestAllowed(api, 1, 10000)) {
            return res.status(403).send({
                status: false,
                message: "Too Many Request",
            });
        }
        try {
            const result = await prisma.user.findFirst({
                where: {
                    api: {
                        api: api
                    }
                },
                select: {
                    name: true,
                    organization: true,
                    api: true,
                    pushes: {
                        skip: page,
                        take: 10,
                        orderBy: {
                            id: 'desc'
                        }
                    }
                },

            });
            result.pushes.forEach(push => {
                data = data.concat(push);
            })

            return res.status(200).send({
                status: true,
                name: result.name,
                message: "success",
                organization: result.organization,
                data: data
            });

        } catch (err) {
            return res.status(404).send({
                status: false,
                message: "Check Your ApiKey"
            });
        }
    }
}

