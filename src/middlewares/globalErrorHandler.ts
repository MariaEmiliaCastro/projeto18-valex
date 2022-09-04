import { Request, Response, NextFunction } from 'express';

export default function globalErrorHandler (err: Error, req: Request, res: Response, next: NextFunction){
    console.error(err);
    res.status(500).send(err.message);
}