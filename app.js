const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
import {get} from './convertAllToInfoPages'

var router = new Router();

router.get('/info-pages/:id*', async (ctx, next) => {
  const id = '/' + ctx.params.id
  ctx.body = await get(id)
});

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
console.info('> running on 3000')
