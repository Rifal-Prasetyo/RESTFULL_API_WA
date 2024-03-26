import { NextFunction, Request, Response } from "express";
import prisma from "../../../database/prisma";
import { validationResult } from "express-validator";
import { WhatsappAction } from "../../../utils/WhatsappAction";


const whatsappAct = new WhatsappAction();
export class MessageWAController {
    public static async sendMessage(req: Request, res: Response, next: NextFunction) {
        const { api_key, receiver, type, data } = req.body;
        const apiKey = await prisma.apiKey.findFirst({
            where: {
                api: api_key
            },
            include: {
                User_use: true
            }

        });
        if (apiKey === null) {
            return res.send({
                code: 404,
                status: false,
                message: "INVALID API KEY!!!",
            });
        } else {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({
                    code: 404,
                    status: false,
                    message: "invalid request",
                });
            } else {
                const rslt = await whatsappAct.sendMessage(receiver, type, data.message);
                if (rslt.status) {
                    await prisma.apiPush.create({
                        data: {
                            type: type,
                            type_msg: 'message',
                            user_id: apiKey.User_use.id,
                            message: data.message,
                            toMsg: receiver,
                            time: new Date(),
                        }
                    });
                    await prisma.apiKey.update({
                        where: {
                            id: apiKey.id
                        },
                        data: {
                            totalUse: {
                                increment: 1
                            }
                        }
                    })
                    return res.send({
                        code: 200,
                        status: true,
                        message: rslt.message,
                    });

                } else {
                    return res.send({
                        code: 500,
                        status: true,
                        message: rslt.message,
                    });
                }
            }
        }

    }
    public static async sendMedia(req: Request, res: Response, next: NextFunction) {
        const { api_key, receiver, type, media, data } = req.body;
        const apiKey = await prisma.apiKey.findFirst({
            where: {
                api: api_key
            },
            include: {
                User_use: true
            }

        });
        if (apiKey === null) {
            return res.send({
                code: 404,
                status: false,
                message: "INVALID API KEY!!!",
            });
        } else {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({
                    code: 404,
                    status: false,
                    message: "invalid request",
                });
            } else {
                const rslt = await whatsappAct.sendMedia(receiver, type, media, data);
                if (rslt.status) {
                    await prisma.apiPush.create({
                        data: {
                            type: type,
                            type_msg: media,
                            user_id: apiKey.User_use.id,
                            message: data.message,
                            toMsg: receiver,
                            time: new Date(),
                        }
                    });
                    await prisma.apiKey.update({
                        where: {
                            id: apiKey.id
                        },
                        data: {
                            totalUse: {
                                increment: 1
                            }
                        }
                    })
                    return res.send({
                        code: 200,
                        status: true,
                        message: rslt.message,
                    });

                } else {
                    return res.send({
                        code: 500,
                        status: true,
                        message: rslt.message,
                    });
                }
            }
        }
    }


}