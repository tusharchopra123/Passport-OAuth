const express = require('express')
const app = express()
const authroutes = require('./routes/auth-routes').route
const passportSetup = require('./config/passport-setup')

const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const profileroutes = require('./routes/profile-routes').route

app.use(express.json())
app.use(express.urlencoded({extended: true}))
//set view engine
app.set('view engine','ejs')

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}))
//initialoze passport
app.use(passport.initialize())
app.use(passport.session())
//connect to mongodb
mongoose.connect(keys.mongodb.dbURI,()=>{
    console.log("connected to mongodb")
})
//set up routes
app.use('/auth',authroutes)
app.use('/profile',profileroutes)

app.use('/',require('./routes/api').route)
//creaet home route
app.get('/',(req,res)=>{
    res.render('home',{user:req.user}) 
})
app.get('/success',(req,res)=>{
    res.sendStatus(200);
})


//listen to port
app.listen(7760,()=>{
    console.log("app now listening onn request on port 7760")
})