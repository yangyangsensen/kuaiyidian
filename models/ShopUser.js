var Sequelize = require('sequelize'); 
var sequelize =require('./ModelHeader')();

var ShopUser = sequelize.define('shopusers', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	shopid:Sequelize.BIGINT,
    email: Sequelize.STRING,
    pwd: Sequelize.STRING,
    nicheng: Sequelize.STRING,
    role:Sequelize.INTEGER,
    createtime:Sequelize.DATE,
    updtime:Sequelize.DATE,
},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = ShopUser;