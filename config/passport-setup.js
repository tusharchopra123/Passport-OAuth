const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
//const FacebookStrategy = require('passpost-facebook')
const keys = require('./keys')
//const User = require('../models/user-model')
const Sequelize = require('sequelize')
const User = require('../models/db').User
const User_facebook = require('../models/db').User_facebook

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
passport.serializeUser((user,done)=>{
   // console.log('here for serliase',user[0].id)
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
        User.findAll({where: {googleId:profile.id}})
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
                    googleId:profile.id,
                    username:profile.displayName,
                    thumbnail:profile._json.picture
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
// passport.use(new FacebookStrategy({
//     clientID: keys.facebook.clientID,
//     clientSecret: keys.facebook.clientSecret,
//     callbackURL: "http://localhost:7760/auth/facebook/redirect"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log("passport callback function fired ")
//         console.log(profile)
//         // User_google.findAll({where: {googleId:profile.id}})
//         // .then((currentUser)=>{
//         //     if(!isEmpty(currentUser)){
//         //         //already user exist
//         //         let user  = JSON.stringify(currentUser);
//         //         console.log('user is',currentUser)
//         //        // console.log(JSON.stringify(currentUser))
//         //         console.log(currentUser[0].id)
                
//         //         done(null,currentUser)
//         //     }else{
//         //         User_google.create({
//         //             googleId:profile.id,
//         //             username:profile.displayName,
//         //             thumbnail:profile._json.picture
//         //         }).then((newUser)=>{
//         //             console.log('new User Created',newUser)
//         //             var user = [newUser.dataValues];
//         //             console.log(user)
//         //             //console.log(newUser[0].id)
//         //             done(null,user)
//         //         }).catch((err)=>{
//         //             console.log(err)
//         //            })    
//         //     }
//         // })
//   }
// ));