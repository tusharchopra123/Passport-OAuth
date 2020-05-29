const Sequelize = require('sequelize')
const keys = require('../config/keys')
const db = new Sequelize(keys.mysql.DATABASE,keys.mysql.USER ,keys.mysql.PASSWORD , {
    host:keys.mysql.HOST,
    dialect: 'mysql',
    port:3306,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const User = db.define('User_local',{
    userId:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement: true,
    },
    username: {
        type:Sequelize.STRING,
    },
    thumbnail: {
        type: Sequelize.STRING,
    },emailId:{
        type:Sequelize.STRING
    }
    ,authenticationType:{
        type:Sequelize.STRING
    },salt:{
        type:Sequelize.STRING
    },authenticationType:{
        type:Sequelize.STRING
    },valid:{
        type:Sequelize.STRING
    },password:{
        type:Sequelize.STRING
    }

})
//  const User_facebook = db.define('User_facebook',{
//      facebookId:{
//         type: Sequelize.STRING,
//     },
//     username: {
//         type:Sequelize.STRING,
//     },
//     thumbnail: {
//         type: Sequelize.STRING,
//     }
// })
db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error creating database "+err))
exports = module.exports = {
    User
    }