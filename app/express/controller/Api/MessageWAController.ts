import { NextFunction, Request, Response } from "express";
import prisma from "../../../database/prisma";
import { validationResult } from "express-validator";
import { WhatsappAction } from "../../../utils/WhatsappAction";
import { isRequestAllowed } from "../../../utils/rateLimiter";


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

        if (apiKey === null && apiKey.User_use.isVerified == 0) {
            return res.send({
                code: 404,
                status: false,
                message: "INVALID API KEY !!! OR HAS BANNED/DELETED",
            });
        } else {
            if (!isRequestAllowed(api_key, 1, 10000)) {
                return res.send({
                    code: 404,
                    status: false,
                    message: "Too Many Request",
                });
            }
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
                    try {
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
                    } catch (err) {
                        return res.send({
                            code: 500,
                            status: true,
                            message: "ERROR: Salah format mungkin, coba teliti lagi",
                        });
                    }

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
        if (apiKey === null && apiKey.User_use.isVerified == 0) {
            return res.send({
                code: 404,
                status: false,
                message: "INVALID API KEY!!! OR HAS BANNED/DELETED",
            });
        } else {
            if (!isRequestAllowed(api_key, 1, 10000)) {
                return res.send({
                    code: 404,
                    status: false,
                    message: "Too Many Request",
                });
            }
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
                    try {
                        await prisma.apiPush.create({
                            data: {
                                type: type,
                                type_msg: media,
                                user_id: apiKey.User_use.id,
                                message: "Caption: " + data.caption,
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
                    } catch (err) {
                        return res.send({
                            code: 500,
                            status: true,
                            message: "ERROR: Salah format mungkin, coba teliti lagi",
                        });
                    }

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