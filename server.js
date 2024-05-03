const express = require ('express')
const server = express()
const port = process.env.PORT || 3000;
const session = require ('express-session')
const passport = require ('passport')
var FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config()


server.set('view engine','ejs')

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    })
)

passport.serializeUser((user,done) => {
    done(null,user)
})

passport.deserializeUser((user,done) => {
    done(null,user)
})


server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))


server.use(passport.initialize())
server.use(passport.session())







server.get('/auth/facebook',
  passport.authenticate('facebook'));

server.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });



server.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages','email'] }));


  function isAuth(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

  server.get('/dashboard',isAuth,(req,res) => {
    // console.log('data user',req.user)
    const dataUser = req.user
    console.log(dataUser)
    res.render('dashboard',{dataUser})    
})


server.get('/dashboard',(req,res) => {
    res.render('dashboard')
})
server.get('/register',(req,res) => {
    res.render('register')
}
)
  server.get('/login',(req, res) => {
    res.render('login')
})


server.listen(port,()=>{
    console.log('listening on port '+port)
})