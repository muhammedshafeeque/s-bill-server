var generator = require('generate-password'); 
var nodemailer = require('nodemailer');
var config=require('../env.json')
var jwt =require('jsonwebtoken')


module.exports={
    generatePassword:()=>{
        return new Promise((resolve,reject)=>{
            let password= generator.generate({
                length: 30,
                numbers: true
            });
            resolve(password)
        })
    },
    sentingMail:(data)=>{
  
        return new Promise (async(resolve,reject)=>{
          
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: config.nodemailer_email,
                  pass:config.nodemailer_password 
                }
              });
            var mailOptions = {
                from: config.nodemailer_email,
                to: data.reciver,
                subject: data.subject,
         
                html:data.html
              };
            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
    
              resolve()
    
        })
    },
    genertToken:(user)=>{
      return new Promise((resolve,reject)=>{
        let id=user.userId
        let secret=config.jwt.sectret
        let token=jwt.sign({id},secret,{
          expiresIn:30000
        })
        resolve(token)
      })
    }
    
}