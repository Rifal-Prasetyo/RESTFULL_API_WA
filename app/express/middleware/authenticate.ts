import jwt from 'jsonwebtoken';
import { secretKey } from '../../config/server';
import { NextFunction, Request, RequestHandler, RequestParamHandler, Response } from 'express';


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authenticate;
