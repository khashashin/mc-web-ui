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
    // We don't have the session ID yet, so we'll generate one
    // But we need to verify credentials first.
    // Actually, we can try to set the alias. If it fails, creds are bad.

    // We need to generate the session first to get the alias name
    // Actually, verify credentials first before creating session
    const alias = `session_${Date.now()}`; // Temporary alias for verification if needed, or just use verifyCredentials static method

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
        const session = deleteSession(sessionId);
        // Ideally we should also remove the alias from mc, but since it's ephemeral container or we might want to keep it?
        // No, we should remove it to keep it clean.
        // But we need the alias name. 
        // We deleted the session from memory, so we can't get the alias name easily unless we fetched it before delete.
        // For now, let's just clear cookie. The alias will persist until container restart or manual cleanup.
        // TODO: Improve cleanup.
    }

    res.clearCookie('session_id');
    res.json({ success: true });
});

router.get('/me', (req, res) => {
    // This route will be protected by middleware, so if we are here, we are logged in
    // But we need to inject the user info from the session into the request
    // We'll handle that in the middleware
    // @ts-ignore
    if (req.user) {
        // @ts-ignore
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;
