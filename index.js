const Koa = require('koa');
const koaStatic = require('koa-static');
const path = require('path');
const app = new Koa();

app
   .use(koaStatic(path.join(__dirname, '/dist')))
   .listen(3333, () => {
      console.log('成功监听3333端口');
   });
