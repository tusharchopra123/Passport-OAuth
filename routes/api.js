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
route.post('/forgotpassword',(req,res)=>{
    var email=req.body.email;
    User.findOne({where:{emailId :email,authenticationType:'local'}})
    .then((user)=>{
        sendmail(user.emailId,user.password,1);
        return res.send({data:'true'})
      }).catch((err)=>{
        return res.send({data:'No user'})
      })
})
route.get('/signup/css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.css'))
})
route.get('/forgotpassword',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/forgotpass.html'))
})
route.get('/forgotpassword/css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/forgotpass.css'))
})
route.get('/activate',(req,res)=>{
    console.log(req.query.mail)
    console.log(req.query.id)
    User.update({   
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
route.get('/forgot',(req,res)=>{
    console.log(req.query.mail)
    console.log(req.query.id)
    console.log(req.query.tm)
    User.update({   
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
        fullname:req.body.name,
        authenticationType:'local',
        salt:salt_1,
        password:hash_password,
        valid:false, 
      }).then((user)=>{
          sendmail(mailing_id,hash,0);
        return res.redirect('/login')
      }).catch((err)=>{
        console.log(err)
        return res.redirect('/login')
      })
})

function sendmail(tomailid,hash,fp){
    var d = new Date();
    var h = d.getHours();
    var m=d.getMinutes();
    var tm=h+''+m;
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: keys.gmail.mail, 
            pass: keys.gmail.password
        } 
    }); 
    //shankygupta79@gmail.com
    //tusharchopra123@gmail.com
    let mailDetails={}
    if(fp==1){
        mailDetails = { 
            from: keys.gmail.mail,
            to: tomailid, 
            subject: 'Reset Your Password', 
            text: 'Reset your password by clicking on the link (link is valid upto five minutes only) '+'http://localhost:7760/forgot?id='+hash+'&tm='+tm+'&mail='+tomailid,
        };
    }else if(fp==0){
    mailDetails = { 
        from: keys.gmail.mail,
        to: tomailid, 
        subject: 'Activate Your Account', 
        text: 'Verify your account by clicking on the link '+'http://localhost:7760/activate?id='+hash+'&mail='+tomailid,
    }; }
    // https://myaccount.google.com/lesssecureapps
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs mailing to'+tomailid+err); 
        } else { 
            console.log('Email sent successfully to'+tomailid); 
        } 
    });
}




exports = module.exports = {
    route,mailing_id
}