var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
...
var users = [
  {username: 'admin', password:'password'}
]; // 用户列表
...
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

var sess;

app.get('/', (req, res) => {
  sess = req.session;
  if(sess.username) {
      return res.redirect('/dashboard');
  }
  res.render('index');
});

app.post('/login', (req, res) => {
  sess = req.session;
  // 在此处应该添加对用户名和密码的实际验证
  // 这样设置只是为了简单显示如何在session工作
  sess.username = req.body.username;
  res.end('done');
});

app.get('/dashboard', (req, res) => {
  sess = req.session;
  if(sess.username) {
      res.write('<h1>Hello '+sess.username+'</h1>');
      res.end('<a href='+'/logout'+'>Logout</a>');
  } else {
      return res.redirect('/');
  }
});

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });
});

app.post('/login', (req, res) => {
  sess = req.session;
  let user = users.find(user => user.username == req.body.username);
  if(user) {
     if(req.body.password === user.password) {
       sess.username = req.body.username;
       res.end('done');
     } else {
       res.end('Incorrect password');
     }
  } else {
    res.end('User does not exist');
  }
});


app.listen(3000);