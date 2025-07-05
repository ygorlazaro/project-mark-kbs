import express from 'express';
const router = express.Router();

router.post('/', (req, res) => res.send('Create user'));
router.get('/:id', (req, res) => res.send('Get user'));

export default router;
