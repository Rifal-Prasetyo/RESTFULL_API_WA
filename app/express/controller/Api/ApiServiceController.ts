import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { trimUndefined } from "@whiskeysockets/baileys";
import { isRequestAllowed } from "../../../utils/rateLimiter";

export class ApiServiceController {
    public static async info(req: Request, res: Response) {
        const api = req.body.apiKey;
        let data = [];
        if (!isRequestAllowed(api, 1, 10000)) {
            return res.status(403).send({
                status: false,
                message: "Too Many Request",
            });
        }
        try {
            const result = await prisma.user.findMany({
                where: {
                    api: {
                        api: api
                    }
                },
                select: {
                    name: true,
                    organization: true,
                    api: true,
                    pushes: true
                },

            });
            result.forEach(user => {
                data = data.concat(user.pushes)
            });

            return res.status(200).send({
                status: true,
                name: result[0].name,
                message: "success",
                organization: result[0].organization,
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

