const Koa = require('koa');
const Router = require('koa');
const app = new Koa();
import {get} from './convertAllToInfoPages'

var router = new Router();

router.get('/info-pages/:id', (ctx, next) => {
  ctx.body = get(id)
});

app
  .use(router.routes())
  .use(router.allowedMethods());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
