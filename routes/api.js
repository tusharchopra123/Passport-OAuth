const route =  require('express').Router();
const Sequelize = require('sequelize')
const User = require('../models/db').User
route.get('/',(req,res)=>{
    User.findAll()
    .then((users)=>{
        res.send(users)
        console.log(users[0].id)
    })
    
})




exports = module.exports = {
    route
}