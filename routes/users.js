const router = require('koa-router')()
var Users = require('../models/UserModel');
const ShopUser = require('../models/ShopUser');
const MenuType = require('../models/MenuModel');
const ChildMenu = require('../models/ChildMenu');
var sequelize =require('../models/ModelHeader')();
const formidable = require('formidable');
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login',async function (ctx,next){
	
let rs =	await new Promise(function(resolve,reject){
	ShopUser.findOne({where:{email:ctx.request.body.email,pwd:ctx.request.body.pwd}}).then(function(rs){
			if(rs!=null){
			  let loginbean=new Object();
				loginbean.id = rs.id;
				loginbean.nicheng = rs.nicheng;
				loginbean.shopid = rs.shopid;
				loginbean.role = rs.role;
				ctx.session.loginbean=loginbean;
				//res.redirect('/');
				resolve(1);
				
			}else{
                 resolve(2); 
			}
		});
		}) 
		if(rs==1){
			ctx.redirect('/users/shop');
			//ctx.body='正确'
		}else{
		  ctx.body='错误'
		}
 
})
router.get('/shop',async function (ctx,next){
	let a = null;
	 let rs = await new Promise(function(resolve,reject){
	   let loginbean = ctx.session.loginbean;
	   let sql='select * from shops where id=?';
	     sequelize.query(sql,{replacements: [loginbean.shopid]}).then(function(rsa){
						     	 a=rsa;
					          if(rsa!=null){
									     resolve(1);
									
										}else{
							         resolve(2); 
										}
        })
	 })
		 if(rs==1){
		 	console.log(a)
		 	 await ctx.render('shopuser/shopIndex',{rs:a[0]});
		 }else{
		 }
	 })

router.post('/waiter',async function (ctx,next){
	 let loginbean = ctx.session.loginbean;
   ctx.request.body.shopid=loginbean.shopid
   ctx.request.body.createtime=new Date();
   try{
   let rs = await  ShopUser.create(ctx.request.body);
   ctx.redirect('./shop');
   }catch(err){
			if(err.errors[0].path=='shopemailuniq'){
				ctx.body='账号重复';
			}else{
				ctx.body = '数据库错误';
			}
		}
	

})
router.get('/person',async function (ctx,next){
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean:loginbean,	
	};
	let sql='select * from usertypes';
	let rstype = await sequelize.query(sql);
	let sqluser='select s.*,u.usertype from usertypes u,shopusers s where s.role=u.id and s.shopid=? ';
	let rs = await   sequelize.query(sqluser,{replacements: [loginbean.shopid]});
	await ctx.render('shopuser/waiter',{rs:rs[0],rstype:rstype[0]});
})

router.get('/menu',async function (ctx,next){
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean:loginbean,	
	};
    let sql='select * from menus where shopid=?';
    let menu = await   sequelize.query(sql,{replacements: [loginbean.shopid]});
		await ctx.render('shopuser/menu',{menu:menu[0]});
		
})

router.post('/newMenuType',async function (ctx,next){
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean:loginbean,	
	};
	ctx.request.body.shopid=loginbean.shopid
	let rs = await MenuType.create(ctx.request.body)
	ctx.redirect('./shop');
})

router.get('/showmenu',async function (ctx,next){
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean:loginbean,	
	};
	let sql='select * from childmenus where shopid=? and typeid=?';
  let rs = await   sequelize.query(sql,{replacements: [loginbean.shopid,ctx.query.typeid]});
  await ctx.render('shopuser/allMenu',{typename:ctx.query.type,typeid:ctx.query.typeid,rs:rs[0]});
})

router.post('/newmenu',async function (ctx,next){
	let rs = await new Promise(function(resolve,reject){
    	
    	var form = new formidable.IncomingForm();   //创建上传表单 
	    form.encoding = 'utf-8';        //设置编辑 
	    form.uploadDir = './public/images/';     //设置上传目录 文件会自动保存在这里 
	    form.keepExtensions = true;     //保留后缀 
	    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
	    form.parse(ctx.req, function (err, fields, files) { 
	        if(err){ 
	            console.log(err); 
	            return;
	        } 
	    	let loginbean = ctx.session.loginbean;
	    	fields.shopid = loginbean.shopid;
	    	fields.createtime =new Date();
			    fields.menusimg=files.menusimg.path.replace('public',''); 
		            ChildMenu.create(fields).then(function(rs){
		
													if(rs!=null){
															resolve(1);
													}else{
									       		  resolve(2); 
													}
						});
		     }) 
     })
    if(rs==1){
			ctx.redirect('./shop');
		}else{
			ctx.body='添加失败'
		}
})

module.exports = router
