import { Elysia } from 'elysia';

import datapacksRouter from './datapacks';
import resourcePacksRouter from './resourcePacks';
import craftingTweaksRouter from './craftingTweaks';
import { checkValidVersion, type MinecraftVersion } from 'core';

const router = new Elysia();

router.onBeforeHandle(({ query: { version } }) => {
  if (version) checkValidVersion(version as MinecraftVersion);
});

router.get('/', () => ({ success: true, message: 'Vanilla Tweaks API' }));
router.group('/resourcepacks', (group) => group.use(resourcePacksRouter));
router.group('/datapacks', (group) => group.use(datapacksRouter));
router.group('/craftingtweaks', (group) => group.use(craftingTweaksRouter));

export default router;
