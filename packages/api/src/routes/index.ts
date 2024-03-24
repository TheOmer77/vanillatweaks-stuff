import { Hono } from 'hono';

// import { checkValidVersion, type MinecraftVersion } from 'core';
import datapacksRouter from './datapacks';
import resourcePacksRouter from './resourcePacks';
import craftingTweaksRouter from './craftingTweaks';

const router = new Hono();

router.get('/', (ctx) =>
  ctx.json({
    success: true,
    title: 'Vanilla Tweaks API',
    credit: 'https://vanillatweaks.net/',
  })
);
router.route('/resourcepacks', resourcePacksRouter);
router.route('/datapacks', datapacksRouter);
router.route('/craftingtweaks', craftingTweaksRouter);

export default router;
