const nodemailer = require('Nodemailer'); 
const keys = require('../keys') 
  
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
    to: 'shankygupta79@gmail.com', 
    subject: 'Test mail', 
    text: 'Node.js testing mail from Node Mailer'
}; 
//Allow access using . . . . . . .
// https://myaccount.google.com/lesssecureapps
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
});