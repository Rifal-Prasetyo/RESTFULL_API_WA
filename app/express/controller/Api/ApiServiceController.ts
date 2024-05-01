import { Request, Response } from "express";
import prisma from "../../../database/prisma";
import { trimUndefined } from "@whiskeysockets/baileys";
import { isRequestAllowed } from "../../../utils/rateLimiter";
import { getSession, infoSessionDetailWhatsapp, init, stateWA } from "../../../whatsapp/whatsapp";
import { InitController } from "../Web/InitController";
import log from "../../../services/pretty-logger";

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
    public static async infoSessionWhatsapp(req: Request, res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const session = getSession('admin');
        const stateWa = await stateWA();
        const log = await prisma.log.findMany();

        const intervalId = setInterval(async () => {
            // check Whatsapp Init
            // Kirim data setiap detik
            const dataWrite = {
                name: session?.user?.name,
                number: session?.user?.id,
                connection: stateWa?.connection,
                isNewLogin: stateWa?.isNewLogin,
                log: log
            }
            res.write(`data: ${JSON.stringify(dataWrite)}\n\n`);
        }, 3000);


        // Handle jika klien terputus
        req.on('close', () => {
            clearInterval(intervalId);
        });
    }
    public static async actionButtonWhatsapp(req: Request, res: Response) {
        const session = getSession('admin');
        if (req.body.action == 'start' || 'stop' || 'logout') {
            switch (req.body.action) {
                case 'start':
                    if (!InitController.isRunning) {
                        init();
                        InitController.isRunning = true;
                    }
                    break;
                case 'stop':
                    if (InitController.isRunning) {
                        session.end(null);
                        InitController.isRunning = false;
                    }
                    break;
                case 'logout':
                    if (InitController.isRunning) {

                        session.logout();
                    }
                    break;
                default:
                    return res.status(403).send({ status: false, message: "Ngapain anda?" });
            }
        } else {
            return res.status(403).send({ status: false, message: "Ngapain anda?" });
        }
    }
}

