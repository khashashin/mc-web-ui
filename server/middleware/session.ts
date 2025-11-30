import { Request, Response, NextFunction } from 'express';
import { getSession } from '../services/session.js';

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.session_id;

    if (sessionId) {
        const session = getSession(sessionId);
        if (session) {
            // @ts-ignore
            req.session = session;
            // @ts-ignore
            req.user = {
                accessKey: session.accessKey,
                endpoint: session.endpoint
            };
        }
    }

    next();
}
