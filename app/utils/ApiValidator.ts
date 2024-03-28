import { NextFunction, Request, Response } from "express";
import { body } from 'express-validator'
export class ApiValidator {
    constructor() {

    }
    sendMessage() {
        return [
            body('api_key').exists().withMessage('Api Key not found'),
            body('receiver').exists().withMessage('Receiver not found'),
            body('type').exists().withMessage('type is not defined'),
            body('data').exists().isObject().withMessage('data must be object'),
        ]
    }
    sendMedia() {
        return [

            body('api_key').exists().withMessage('Api Key not found'),
            body('receiver').exists().withMessage('Receiver not found'),
            body('type').exists().withMessage('type is not defined'),
            body('media').exists().withMessage('type not found'),
            body('data').exists().isObject().withMessage('data must be object'),
        ]
    }
    registerSerialize() {
        return [
            body('name').isLength({ min: 5 }),
            body('noWa').exists(),
            body('organization').exists(),
            body('name_project').exists(),
            body('address').isLength({ min: 3 }),
            body('note').isLength({ min: 10 }),
            body('password').exists(),
        ];
    }
}                