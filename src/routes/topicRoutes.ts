import express from 'express';
const router = express.Router();

router.post('/', (req, res) => res.send('Create topic'));
router.get('/:id', (req, res) => res.send('Get topic'));
router.get('/:id/tree', (req, res) => res.send('Get topic tree'));
router.get('/:id/version/:version', (req, res) => res.send('Get topic version'));
router.get('/shortest-path', (req, res) => res.send('Get shortest path'));

export default router;
