import { Request, Response, NextFunction } from 'express';

export default function globalErrorHandler (err: Error, req: Request, res: Response, next: NextFunction){
    console.log(err);
    res.status(500).send(err.message);
}