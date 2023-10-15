import { Elysia } from 'elysia';

const router = new Elysia();

router.get('/', () => ({ success: true, message: 'Vanilla Tweaks API' }));

export default router;
