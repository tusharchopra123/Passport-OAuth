const route = require('express').Router();
const passport = require('passport')
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
    scope:['profile']
}))
//route.get('/facebook',passport.authenticate('facebook'))
// route.get('/facebook/redirect',passport.authenticate('facebook'),{failureRedirect: '/login'},(req,res)=>{
//     res.redirect('/profile/')
// })

//calback route for google to redirect
route.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
   
    //res.send( req.user)

    res.redirect('/profile/')
})
exports = module.exports = {
    route
}