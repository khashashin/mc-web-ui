import { Request, Response, NextFunction } from 'express';
import { getSession } from '../services/session.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = getSession(sessionId);

    if (!session) {
        res.clearCookie('session_id');
        return res.status(401).json({ error: 'Session expired' });
    }

    // Attach session to request
    // @ts-ignore
    req.session = session;
    // @ts-ignore
    req.user = { accessKey: session.accessKey, endpoint: session.endpoint };

    next();
}
