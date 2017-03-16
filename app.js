var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var http = require('http');
var partials = require('express-partials');
var routes = require('./routes'); //等同於"./routes/index.js"，指定路徑返回內容，相當於MVC中的Controller
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 指定頁面模板位置，在views子目錄下
app.set('view engine', 'ejs'); // 表明要使用的模板引擎是ejs

app.use(partials()); // express 新版不支援ejs 因此要另外加入 express-partials lib
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mongoDB init

if(process.argv[2] == null)
{
  console.log("連接 mlab 資料庫");
  mongoose.connect('mongodb://kk:kk@ds041526.mlab.com:41526/imagetodolist'); // 使用 mlab 上的 mongoDB
}
else{
  console.log("port : " + process.argv[2]);
  console.log("連接本地端資料庫");
  mongoose.connect('mongodb://localhost:'+process.argv[3]+'/examdb'); // 使用本機啟動的 mongoDB
}

var db = mongoose.connection;

db.on('error',function(err){
  console.log(err);
});

db.on('connected',function(){
  var conn = mongoose.connection;
  var Schema = mongoose.Schema;
  var itemSchema = new Schema({
        name: String,
        description: String,
        price: String,
        size: {width:String, height:String},
        imgUrl: String
      });
    
  itemSchema.plugin(timestamps);
        
  //global 用來宣告 ItemData 為全域變數 , 此寫法並不安全要再進行修正   
  global.ItemData = conn.model('ItemData',itemSchema);

});

//routes
//路由控制器，用戶如果訪問"/"路徑，則由routes.index來控制。
//將"/"路徑對應到exports.index函數下。
app.get('/',routes.index);

app.post('/',routes.Select);

app.get('/ItemView/:id', routes.ItemView);

app.get('/addItem', routes.addItem);

app.post('/addItem', routes.addItemPost);

app.get('/destroy/:id', routes.destroy);

app.get('/edit/:id', routes.edit);

app.post('/update/:id', routes.update)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function( req, res ){ 

	//建立app instance
	//服務器通過app.listen（3000）;啟動，監聽3000端口。
	console.log('Express server listening on port ' + app.get('port'));
  
});