import { Elysia } from 'elysia';

import datapacksRouter from './datapacks';
import resourcePacksRouter from './resourcePacks';
import craftingTweaksRouter from './craftingTweaks';

const router = new Elysia();

router.get('/', () => ({ success: true, message: 'Vanilla Tweaks API' }));
router.group('/resourcepacks', (group) => group.use(resourcePacksRouter));
router.group('/datapacks', (group) => group.use(datapacksRouter));
router.group('/craftingtweaks', (group) => group.use(craftingTweaksRouter));

export default router;
