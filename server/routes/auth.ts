import { Router } from 'express';
import { McClient } from '../services/mc.js';
import { createSession, deleteSession } from '../services/session.js';

const router = Router();

router.post('/login', async (req, res) => {
    const { endpoint, accessKey, secretKey } = req.body;

    if (!endpoint || !accessKey || !secretKey) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    // Create a temporary session to generate an alias
    const alias = `session_${Date.now()}`;

    const result = await McClient.verifyCredentials(
        alias,
        endpoint,
        accessKey,
        secretKey
    );

    if (result.success) {
        const session = createSession(accessKey, secretKey, endpoint);

        // Set cookie
        res.cookie('session_id', session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ success: true, user: { accessKey, endpoint } });
    } else {
        res.status(401).json({ error: 'Invalid credentials or unreachable endpoint' });
    }
});

router.post('/logout', async (req, res) => {
    const sessionId = req.cookies?.session_id;

    if (sessionId) {
        deleteSession(sessionId);
    }

    res.clearCookie('session_id');
    res.json({ success: true });
});

router.get('/me', (req, res) => {
    // @ts-ignore
    if (req.user) {
        // @ts-ignore
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

router.get('/connection-info', (req, res) => {
    // @ts-ignore
    if (!req.session || !req.session.endpoint) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
        // @ts-ignore
        endpoint: req.session.endpoint,
        // @ts-ignore
        accessKey: req.session.accessKey,
        // @ts-ignore
        secretKey: req.session.secretKey,
        region: 'us-east-1', // Default region for MinIO
    });
});

export default router;
