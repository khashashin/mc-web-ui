import { Router } from 'express';
import { McClient } from '../services/mc.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/buckets
router.get('/', async (req, res) => {
    // @ts-ignore
    const mc = new McClient(req.session);
    const result = await mc.listBuckets();

    if (result.success) {
        res.json({ buckets: result.data });
    } else {
        res.status(500).json({ error: result.error });
    }
});

// POST /api/buckets
router.post('/', async (req, res) => {
    const { name } = req.body;

    if (!name || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(name)) {
        return res.status(400).json({ error: 'Invalid bucket name' });
    }

    // @ts-ignore
    const mc = new McClient(req.session);
    const result = await mc.createBucket(name);

    if (result.success) {
        res.json({ message: 'Bucket created', name });
    } else {
        res.status(500).json({ error: result.error });
    }
});

// DELETE /api/buckets/:name
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const { force } = req.query;

    // @ts-ignore
    const mc = new McClient(req.session);
    const result = await mc.deleteBucket(name, force === 'true');

    if (result.success) {
        res.json({ message: 'Bucket deleted', name });
    } else {
        res.status(500).json({ error: result.error });
    }
});

// GET /api/buckets/:name/objects
router.get('/:name/objects', async (req, res) => {
    const { name } = req.params;
    const { prefix } = req.query;

    // @ts-ignore
    const mc = new McClient(req.session);
    const result = await mc.listObjects(name, prefix as string || '');

    if (result.success) {
        res.json({ objects: result.data });
    } else {
        res.status(500).json({ error: result.error });
    }
});

export default router;
