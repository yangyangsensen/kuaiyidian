const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')();
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var session = require('koa-generic-session');
const index = require('./routes/index')
const users = require('./routes/users')
const admin = require('./routes/admin')
// error handler
onerror(app)

app.keys = ['my secret key'];
app.use(session());



// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

var openPage = ['/'];
//public下html不走拦截器路由
app.use(async (ctx, next) => { 
    var url = ctx.originalUrl;
    console.log('url='+url);
    url = (url.split('?'))[0];
    if(openPage.indexOf(url)>-1){
    	await next();
    }else{
    	if(ctx.session.loginbean){
	  		await next();
	  	}else{
	  		ctx.redirect('/');
	  	}
    }
});
module.exports = app
