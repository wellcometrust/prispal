const Koa = require('koa');
const Router = require('koa');
const app = new Koa();

var router = new Router();

router.get('/', (ctx, next) => {
  // ctx.router available
});

app
  .use(router.routes())
  .use(router.allowedMethods());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
