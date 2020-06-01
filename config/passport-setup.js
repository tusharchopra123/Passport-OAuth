const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const LocalStrategy = require('passport-local').Strategy
var crypto = require('crypto'); 
const keys = require('./keys')
const User = require('../models/db').User
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
passport.serializeUser((user,done)=>{
    console.log('here for serliase',user[0].id)
    done(null,user[0].id)
})
passport.deserializeUser((id,done)=>{
    User.findAll({where: {id:id}})
    .then((user)=>{
        done(null,user)
    }).catch((err)=>{
        done(err)
    })    
})
passport.use(
    new GoogleStrategy({
        callbackURL:"https://login.tush.tech/auth/google/redirect",
        clientID:keys.google.clientID,
        clientSecret: keys.google.clientSecret
        //options for google strategy
    },(accessToken,refreshToken,profile,done)=>{
        console.log("passport callback function fired ")
        console.log(profile)
        User.findAll({where: {userId:profile.id,authenticationType:'Google'}})
        .then((currentUser)=>{
            if(!isEmpty(currentUser)){
                //already user exist
                console.log('user is',currentUser)
                console.log(currentUser[0].id)
                done(null,currentUser)
            }else{
                User.create({
                    userId:profile.id,
                    fullname:profile.displayName,
                    thumbnail:profile._json.picture,
                    emailId:profile._json.email,
                    authenticationType:'Google',
                }).then((newUser)=>{
                    console.log('new User Created',newUser)
                    var user = [newUser.dataValues];
                    console.log(user)
                    done(null,user)
                }).catch((err)=>{
                    console.log(err)
                  })    
            }
        })
    })
)
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "https://login.tush.tech/facebook/redirect",
    profileFields: ['id','displayName','photos','email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("passport callback function fired ")
        console.log(profile)
        console.log(profile.id)
        console.log(profile._json.picture.data)
         User.findAll({where: {userId:profile.id,authenticationType:'Facebook'}})
         .then((currentUser)=>{
             console.log(currentUser)
             if(!isEmpty(currentUser)){
                 //already user exist
                 let user  = JSON.stringify(currentUser);
                 console.log('user is',currentUser)
                 console.log(JSON.stringify(currentUser))
                 console.log(currentUser[0].id)
                 done(null,currentUser)
             }else{
                 User.create({
                     userId:profile.id,
                     fullname:profile.displayName,
                     thumbnail:profile._json.picture.data.url,
                     emailId:profile._json.email,
                     authenticationType:'Facebook'
                 }).then((newUser)=>{
                     console.log('new User Created',newUser)
                     var user = [newUser.dataValues];
                     console.log(user)
                       done(null,user)
                  }).catch((err)=>{
                     console.log(err)
                    })    
             }
         })
  }
));

passport.use('login', new LocalStrategy({
    passReqToCallBack : true
  },(email, password, done)=> { 
    var salti='';
    var hash='';
    var hash_created='';
    User.findOne({where:{emailId  :email}}) 
      .then((user)=>{
        var users =[user.dataValues];
        console.log(users)
        if(users[0].authenticationType=='local'&&users[0].valid=='0'){
            return done(null,false,{message:"ve"})//The email is not validate till not
        }
        if(users[0].authenticationType == 'Google'){
            return done(null,false,{message:"ag"})//The user exist with google
        }else if(users[0].authenticationType == 'Facebook'){
            return     done(null,false,{message:"af"})}//The user exist with facebook
       salti=user.salt
       hash=user.password  
       hash_created = crypto.pbkdf2Sync(password,salti, 1000, 64,`sha512`).toString(`hex`); 
       if(hash_created==hash){
            console.log("Correct Password")//The password is correct
            console.log(email +" Autheticated")
            
            done(null,[user])
       }
       if(hash_created!=hash){
        err="Wrong Password"
        return done(null,false,{message:"wp"})//The password entered is wrong
       }
       }).catch((err)=>{
       //IF USER NOT FOUND OR CHECK IF USER IS FROM GOOGLE
       return done(null,false,{message:"ue"})//User Not exist
      })    
}));
