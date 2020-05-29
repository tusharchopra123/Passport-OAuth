const route =  require('express').Router();
var crypto = require('crypto'); 
const Sequelize = require('sequelize')
var path=require('path')
const User = require('../models/db').User
const nodemailer = require('Nodemailer'); 
const keys = require('../config/keys') 

route.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/sign.html'))
})
route.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'))
})
route.get('/signup/css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.css'))
})
route.get('/activate',(req,res)=>{
    console.log(req.query.mail)
    console.log(req.query.id)
    User.update({   name: req.body.name,
        valid:true
    },{where:{emailId:req.query.mail,password:req.query.id}})
    .then((user) => {
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send({
            error: "Could not activate the user"
        })
    })
    res.redirect('/login');
})

route.post('/login',(req,res)=>{
    var salt = crypto.randomBytes(16).toString('hex');
    var hash_password = crypto.pbkdf2Sync(req.body.password,salt, 1000, 64,`sha512`).toString(`hex`);
    console.log(req.body.email)

})
mailing_id='';
hash=''
route.post('/signup',(req,res)=>{
    var salt_1 = crypto.randomBytes(16).toString('hex');
    var hash_password = crypto.pbkdf2Sync(req.body.password,salt_1, 1000, 64,`sha512`).toString(`hex`);
    mailing_id=req.body.email;
    hash=hash_password;
    User.create({
        username:req.body.username,
        emailId:req.body.email,
        name:req.body.name,
        authenticationType:'local',
        salt:salt_1,
        password:hash_password,
        valid:false, 
      }).then((user)=>{
          sendmail(mailing_id,hash);
        return res.redirect('/login')
      }).catch((err)=>{
        console.log(err)
        return res.redirect('/login')
      })
})
function sendmail(tomailid,hash,id){
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: keys.gmail.mail, 
            pass: keys.gmail.password
        } 
    }); 
    //shankygupta79@gmail.com
    //tusharchopra123@gmail.com
    let mailDetails = { 
        from: keys.gmail.mail,
        to: tomailid, 
        subject: 'Test mail', 
        text: 'Verify your account by clicking on the link '+'http://localhost:7760/activate?id='+hash+'&mail='+tomailid,
    }; 
    // https://myaccount.google.com/lesssecureapps
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs mailing to'+tomailid); 
        } else { 
            console.log('Email sent successfully to'+tomailid); 
        } 
    });
}




exports = module.exports = {
    route,mailing_id
}