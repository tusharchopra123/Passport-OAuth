const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const LocalStrategy = require('passport-local').Strategy
const bCrypt = require('bcrypt')
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
    }).catch((err)=>{
        done(err)
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
                    fullname:profile.displayName,
                    thumbnail:profile._json.picture,
                    emailId:profile._json.email,
                    authenticationType:'Google',
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
                     fullname:profile.displayName,
                     thumbnail:profile._json.picture.data.url,
                     emailId:profile._json.email,
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

passport.use('signup',
    new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
        //options for google strategy
    },(req,username,password,done)=>{
    //     console.log("passport callback function fired ")
        console.log("here in passport",req.body.fullname)
        console.log("here in passport",password)
        console.log("here in passport",username)
       // console.log("here in passport",fullname)
     User.findAll({where: {emailId:req.body.email,authenticationType:'Local'}})
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
                       username:req.body.username,
                       thumbnail:'https://www.yourfirstpatient.com/assets/default-user-avatar-thumbnail@2x-ad6390912469759cda3106088905fa5bfbadc41532fbaa28237209b1aa976fc9.png',
                       emailId:req.body.email,
                       authenticationType:'Local',
                       password:req.body.password,
                       fullname:req.body.fullname
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
     })
 )
passport.use('login', new LocalStrategy({
    passReqToCallBack : true
  },(email, password, done)=> { 
      console.log(email)
      User.findAll({where:{emailId  : email}}) 
        .then((user)=>{
            console.log(user)
             done(null,user)               
        }).catch((err)=>{
            console.log(err)
            return done(err)
        })
    
    
}));
