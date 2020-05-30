const route = require('express').Router();
var crypto = require('crypto'); 
const flash = require('connect-flash')
route.use(flash())
const passport = require('passport')
const path = require('path')
const User = require('../models/db').User;
//auth login
route.get('/login',(req,res)=>{
    res.render('login',{user:req.user})
})
//auth logout
route.get('/logout',(req,res)=>{
    //handle with passport
    req.logout()
    res.redirect('/')
})  
//auth with google
route.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))
route.get('/facebook',passport.authenticate('facebook',{
    scope: ['user_friends', 'email', 'public_profile']
}))
route.get('/facebook/redirect',passport.authenticate('facebook',{failureRedirect: '/login'}),(req,res)=>{
    res.redirect('/profile/')
})
route.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/sign.html'),{user:req.user})
})
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
route.post('/signup',passport.authenticate('signup',{
    successRedirect: '/profile',
    failureRedirect: '/auth/signup',
    failureFlash:true
}))
route.get('/local',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'),{message:req.flash('error')})
})
route.get('/failureDirect',(req,res)=>{
    console.log(req.flash('error'));
})
route.get('/successDirect',(req,res)=>{
    res.status(200).send('true');
})
 route.post('/local',passport.authenticate('login',{
    successRedirect: '/auth/successDirect',
    failureRedirect: '/auth/failureDirect',
    failureFlash: true
 }));
route.get('/login.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.css'))
})
//calback route for google to redirect
route.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    //res.send( req.user)
    res.redirect('/profile/')
})
exports = module.exports = {
    route
}