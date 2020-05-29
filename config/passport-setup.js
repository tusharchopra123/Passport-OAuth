const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const keys = require('./keys')
//const User = require('../models/user-model')
const Sequelize = require('sequelize')
const User = require('../models/db').User
//const User_facebook = require('../models/db').User_facebook

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
    })
    
})

passport.use(
    new GoogleStrategy({
        callbackURL:"/auth/google/redirect",
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
                let user  = JSON.stringify(currentUser);
                console.log('user is',currentUser)
               // console.log(JSON.stringify(currentUser))
                console.log(currentUser[0].id)
                
                done(null,currentUser)
            }else{
                User.create({
                    userId:profile.id,
                    username:profile.displayName,
                    thumbnail:profile._json.picture,
                    authenticationType:'Google'
                }).then((newUser)=>{
                    console.log('new User Created',newUser)
                    var user = [newUser.dataValues];
                    console.log(user)
                    //console.log(newUser[0].id)
                    done(null,user)
                }).catch((err)=>{
                    console.log(err)
                  })    
            }
        })
        
        // new User({
        //     username: profile.displayName,
        //     googleId: profile.id
        // }).save()
        // .then((newUser)=>{
        //     console.log('new User Created'+newUser)
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
        //passport callback function
    })
)
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "http://localhost:7760/auth/facebook/redirect",
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
                     username:profile.displayName,
                     thumbnail:profile._json.picture.data.url,
                     authenticationType:'Facebook'
                 }).then((newUser)=>{
                     console.log('new User Created',newUser)
                     var user = [newUser.dataValues];
                     console.log(user)
                     //console.log(newUser[0].id)
                       done(null,user)
                  }).catch((err)=>{
                     console.log(err)
                    })    
             }
         })
  }
));