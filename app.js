var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')
var companyRouter=require('./routes/company')
var userRouter=require('./routes/user')
var app = express();
var cors=require('cors')
var db=require('./Config/Connection')
var jwt =require('jsonwebtoken')
var commonService=require('./Services/common')
var config=require('./env.json')

const verifyLogin = (req, res, next) => {

  let token= req.headers["x-access-token"]
    if (token) {
      jwt.verify(token,config.jwt.sectret,(err,decodded)=>{
        if(err){
          res.json({user:false,message:"invalid tocken"})
        }else{
          next()
        }

      })
     
    } else {
      res.json({user:false,message:'we need tocken for more process'})
    }
  }
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//middlevares

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'key',cookie:{maxAge:600000}}))
//database connection

db.connect((err)=>{
  if(err) console.log('connection Error'+err)
  else console.log('Database Connected')
 })

 //routers
app.use('/', indexRouter);
app.use('/auth',authRouter)
app.use('/company',verifyLogin,companyRouter)
app.use('/user',verifyLogin,userRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
