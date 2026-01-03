import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { LoggerService } from '../../infrastructure/logger/LoggerService';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            LoggerService.warn('Validation Failed', { path: req.path, errors: error.errors });
            return res.status(400).json({
                error: 'Validation Error',
                details: error.errors
            });
        }
        next(error);
    }
};
