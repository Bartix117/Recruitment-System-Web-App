import { Request, Response, NextFunction } from 'express';

export function globalErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error('Wykryto błąd:', err.message);

    const status = err.status || 500;
    const message = err.message || 'Wystąpił nieoczekiwany błąd serwera';

    res.status(status).json({ error: message });
}