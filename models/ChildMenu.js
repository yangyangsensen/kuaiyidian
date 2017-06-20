var Sequelize = require('sequelize'); 
var sequelize =require('./ModelHeader')();

var ChildMenu = sequelize.define('childmenus', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	shopid:Sequelize.BIGINT,
	typeid:Sequelize.BIGINT,
    menusname: Sequelize.STRING,
    menusimg: Sequelize.STRING,
    menusintro: Sequelize.STRING,
    currentprice: Sequelize.DECIMAL,
    costprice: Sequelize.DECIMAL,
    praise: Sequelize.INTEGER,
    createtime:Sequelize.DATE,
    updtime:Sequelize.DATE,
},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = ChildMenu;