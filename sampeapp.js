var express = require('express'); //node.js  express 라이브러리 사용
var fs = require('fs');
var app = express();

var light = ""; //빛 
var humi = "";
var temp = "";

var rLight = "";
var rMinute = "";
var rVolume = "";


// 요청 처리
app.get('/', function doRequest(req, res) {

   fs.readFile('main.html', 'UTF-8',  //main.html
       function(err, data) {
           var title = "페이지";
           var data2 = data.
           replace(/@light@/g,light).   //@light@를 light값으로 대체
           replace(/@title@/g, title).  
           replace(/@humi@/g,humi).
           replace(/@temp@/g,temp);
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write(data2);
           res.end();
       });
});
app.get('/auto.html',function doRequest(req, res) {

    fs.readFile('auto.html', 'UTF-8', 
        function(err, data) {
            var title = "페이지";
            var data2 = data.
            replace(/@light@/g,light).
            replace(/@title@/g, title).
            replace(/@humi@/g,humi).
            replace(/@temp@/g,temp);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data2);
            res.end();
        });
 });

 app.get('/select.html',function doRequest(req, res) {

    fs.readFile('select.html', 'UTF-8', 
        function(err, data) {
            var title = "페이지";
            var data2 = data.
            replace(/@light@/g,light).
            replace(/@title@/g, title).
            replace(/@humi@/g,humi).
            replace(/@temp@/g,temp);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data2);
            res.end();
        });
 });

 app.get('/post_check', function doRequest(req, res){ //select한 것들을 
     var ldate = req.query.light;   //html의 light값 갖고와서 ldate에 저장
     var minute = req.query.minute;
     var vol = req.query.volume;

const value = '0,' + ldate + ','+ vol + ',' +minute; //다시 TAS 파트에 데이터를 전송하기 위해 우리만의 통신 규약으로 STRING화 하는 작업
console.log(value); //CHECK

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');    //소켓 오픈

var msg = new Buffer(value); //msg에 value값 저장
socket.send(msg, 0, msg.length, 3000, '192.168.1.129', //UDP통신으로 msg 전송
    function(err) {
        console.log(err);
        if ( err ) {
            console.log('UDP message send error', err);
            return;
        }
        console.log('전송완료!');//mode,R,G,B,Light,music select, volume, timer(minute)
        socket.close();        
    }
);

     fs.readFile('main.html', 'UTF-8', 
        function(err, data) {
            var title = "페이지";
            var data2 = data.
            replace(/@light@/g,light).
            replace(/@title@/g, title).
            replace(/@humi@/g,humi).
            replace(/@temp@/g,temp);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data2);
            res.end();
        });
 })

 app.get('/post_check1', function doRequest(req, res){
    var rgb1 = req.query.rgb1;
    var rgb2 = req.query.rgb2;
    var rgb3 = req.query.rgb3;
    var music = req.query.music;
    var ldate = req.query.light;
    var minute = req.query.minute;
    var vol = req.query.volume;

const value = '1,' + rgb1 + ','+ rgb2 + ','+ rgb3 + ',' +ldate+ ',' +music +','+ vol + ',' +minute;
console.log(value);

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var msg = new Buffer(value);
socket.send(msg, 0, msg.length, 3000, '192.168.1.129',
   function(err) {
       console.log(err);
       if ( err ) {
           console.log('UDP message send error', err);
           return;
       }
       console.log('전송완료!');//mode,R,G,B,Light,music select, volume, timer(minute)
       socket.close();        
   }
);

    console.log(ldate,minute,vol);
    fs.readFile('main.html', 'UTF-8', 
       function(err, data) {
           var title = "페이지";
           var data2 = data.
           replace(/@light@/g,light).
           replace(/@title@/g, title).
           replace(/@humi@/g,humi).
           replace(/@temp@/g,temp);
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write(data2);
           res.end();
       });
})


 app.listen(3303, function(){
     console.log('Server Start');
 });

 
var mysql = require('mysql');  // node.js mysql 라이브러리



var con = mysql.createConnection({ // mysql과 연동단계

  host : "localhost",   //hostname

  user : "root",        //username
    
  password : "et0652",  //pw

  database : "mobiusdb" //dbname

});

con.connect(function(err) { //최초 연결하자마자 바로 작동하게끔 한번더 선언
  
  if (err) throw err;

  var sql = 'SELECT con from cin order by ri desc limit 1';  //mobius db안의 cin으로부터 ri값이 가장 큰 con값 가져오기(가장 최신의 데이터 ri값은 계속 올라감)

  con.query(sql, function (err, result, fields) {

    if (err) throw err;
    
    var strings = JSON.stringify(result);  //JSON을 통해 스트링화
    
    var garbage  = strings.indexOf('\"');      
    garbage = strings.indexOf('\"',garbage+1);
    garbage = strings.indexOf('\"',garbage+1);
    var first = strings.indexOf(',',garbage+1);
    var second = strings.indexOf(',',first+1);
    var third = strings.indexOf(',',second+1);

    light = strings.substring(garbage+1,first);
    humi = strings.substring(first+1,second);
    temp = strings.substring(second+1,third);  //줄로 읽어오는 데이터값 ,을 기준으로 split해서 parsing

    

    

  });
  


  setInterval(function(){ //2초에 한번씩 데이터값 불러오기 

  if (err) throw err;

  var sql = 'SELECT con from cin order by ri desc limit 1';

  con.query(sql, function (err, result, fields) {

    if (err) throw err;
    
    var strings = JSON.stringify(result);
    
    var garbage  = strings.indexOf('\"');
    garbage = strings.indexOf('\"',garbage+1);
    garbage = strings.indexOf('\"',garbage+1);
    var first = strings.indexOf(',',garbage+1);
    var second = strings.indexOf(',',first+1);
    var third = strings.indexOf(',',second+1);

    light = strings.substring(garbage+1,first);
    humi = strings.substring(first+1,second);
    temp = strings.substring(second+1,third);




  });
},2000);
});