//list dependencies
const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const path = require('path');
//configure database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'teamVERM123!',
    database: 'finalDB'
});
//connect to the database
db.connect(()=> {
  console.log('Database connection secured!');
});
const app = express();
//config of dependencies
app.set('views', path.join(__dirname, 'pugfiles'));
app.set('view-engine', 'pug');
app.use(cookieParser());

//createdb if not available
app.get('/create', (req,res)=>{
  var sql = 'CREATE DATABASE finalDB';
  db.query(sql,(err,result)=>{
    if(err) throw err;
    console.log(result);
    res.send('Database created successfully');
  });
});
//create sessions table
app.get('/sessions', (req,res)=>{
  var sql = 'CREATE TABLE sessions(sessionID INT AUTO_INCREMENT primary key, name VARCHAR(255), width DOUBLE(10,2), time BIGINT, date VARCHAR(255), sessionStatus TINYINT)';
  db.query(sql, (err,result)=>{
    if (err) throw err;
    res.send('sessions Table created successfully!');
  });
});
//create events table
app.get('/events', (req,res)=>{
  var sql = 'CREATE TABLE events(sessionID INT AUTO_INCREMENT primary key, name VARCHAR(255), type VARCHAR(255), value INT, time BIGINT, date VARCHAR(255))';
  db.query(sql, (err,result)=>{
    if (err) throw err;
    res.send('events Table created successfully!');
  });

});
//register
app.get('/register', (req, res) => {
  var name = req.query.name;
  var width = req.query.width;
  var time = req.query.time;
  var date = moment().format('MMMM Do, YYYY, h:mm:ss');
  var sql = "INSERT INTO sessions (name, width, date, time, sessionStatus) VALUES ?";
  var dataArray = [
    [name, width, date, time, '1']
  ];
  var query = db.query(sql, [dataArray], (err, result) => {
    if (err) throw err;
    res.send('The user name and width data have been added!');
  });
});
//wheels
app.get('/wheels', (req,res)=>{
    var l = req.query.left;
    var r = req.query.right;
    var time = req.query.time;
    var date = moment().format('MMMM Do, YYYY, h:mm:ss');
    var sql = "INSERT INTO events (name, type, value, date, time) VALUES ?";
    var data = [
        [req.cookies['USER'],"left", l, date, time],
        [req.cookies['USER'],"right", r, date, time]
    ];
    var query = db.query(sql, [data], (err, result) =>{
        if(err) throw err;
        res.send('Wheel speed and time data have been updated!');
    });
});
//echo
app.get('/echo', (req, res) => {
  var distance = req.query.dist;
  var time = req.query.time;
  var date = moment().format('MMMM Do, YYYY, h:mm:ss');
  var sql = "INSERT INTO events (name, type, value, date, time) VALUES ?";
  var data = [
    [req.cookies['USER'], "distance", distance, date, time],
  ]
  var query = db.query(sql,[data], (result) => {
    res.send('Distance data has been updated!')
  })
});
//line
app.get('/line', (req, res) => {
  var l1 = req.query.l1;
  var l2 = req.query.l2;
  var l3 = req.query.l3;
  var time = req.query.time;
  var date = moment().format('MMMM Do, YYYY, h:mm:ss');
  var sql = "INSERT INTO events (name, type, value, date, time) VALUES ?";
  var data = [
    [req.cookies['USER'], "l1", l1, date, time],
    [req.cookies['USER'], "l2", l2, date, time],
    [req.cookies['USER'], "l3", l3, date, time]
  ]
  var query = db.query(sql,[data], (result) => {
    res.send('Line  data has been updated!')
  })
});
//other
app.get('/other', (req, res) => {
  var ir = req.query.ir;
  var time = req.query.time;
  var date = moment().format('MMMM Do, YYYY, h:mm:ss');
  var sql = "INSERT INTO events (name, type, value, date, time) VALUES ?";
  var data = [
    [req.cookies['USER'], "ir", ir, date, time],
  ]
  var query = db.query(sql,[data], (result) => {
    res.send('Other data has been updated!')
  })
});
//end
app.get('/end', function(req, res) {
   res.clearCookie('USER');
   var sql = `UPDATE sessions SET sessionStatus = 0`;
   var query = db.query(sql, (result) => {
     res.send(`Session completed`);
     })
});
//active
app.get('/active', function(req, res) {
  db.query("SELECT * FROM sessions WHERE sessionStatus = 1", function (err, result, fields) {
    if (err) throw err;
    res.render('active.pug',{
     sessions: result
   });
  });
});
//review
app.get('/review', function(req, res) {
  db.query("SELECT * FROM sessions", function (err, result, fields) {
    if (err) throw err;
    res.render('review.pug',{
     sessions: result
   });
  });
});
//datareview
app.get('/datareview', function(req, res) {
  db.query("SELECT * FROM events", function (err, result, fields) {
    if (err) throw err;
    res.render('datareview.pug',{
     events: result
   });
  });
});

app.listen(3000, (err)=>{
if(err)
throw err;
console.log('listening on port 3000');
});
