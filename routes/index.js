var express = require('express');
var router = express.Router();

//顯示首頁 - 將所有的資料顯示
exports.index = function(req,res,next){
    ItemData.find().sort('-createdAt').exec().then(function(itemdatas){
        console.log("itemdatas.index= " + itemdatas.length);    
        if(itemdatas.length != 0)
        {
            res.render('index',{    //render 是使用模板引擎的語法，並將其產生的頁面直接返回给client端
                title: 'index',
                items: itemdatas
                });
        }
        else
        {
            res.render('addItem', {
                title: 'addItem'
                });
        }
    },next);
};

// 修改資料名稱
exports.edit = function( req, res, next ){
    var params = req.params;
    var id = params.id;
    ItemData.findById(id).exec().then(function (post) {
        res.render('edit', {
            title: 'edit',
            item: post
        });
    }, next);
};

// 單筆資料顯示
exports.ItemView = function(req,res,next){
    var params = req.params;
    var id = params.id;
    ItemData.findById(id).exec().then(function (post) {
        res.render('ItemView', {
            title: 'ItemView',
            item: post
        });
    }, next);
};

// 刪除資料
exports.destroy = function ( req, res, next ){
  ItemData.findById( req.params.id, function ( err, item ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;
 
    if( item.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    item.remove( function ( err, item ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};

// 查詢資料庫
exports.Select = function(req,res,next){
     var data = req.body;
    
    if(data.tmp=='')
    {
        ItemData.find().sort('-createdAt').exec().then(function(itemdatas){
            res.render('index',{
                title: 'index',
                items: itemdatas
            });
        },next);
    }
    else
    {
        ItemData.find({name:data.tmp}).sort('-createdAt').exec().then(function(itemdatas){
            res.render('index',{
                title: 'index',
                items: itemdatas
            });
            res.redirect('/');    
        },next);
    }
};

// 顯示新增資料頁面
exports.addItem = function(req,res,next){
     res.render('addItem', {
        title: 'addItem'
    });
};

// 新增資料
exports.addItemPost = function(req,res,next){
    var data = req.body;

    ItemData.create(data).then(function (post /**建立好的資料 */) {
        res.redirect('/');
        }, next);
};

// 結束後重新顯示此頁
exports.update = function ( req, res ){
  ItemData.findById( req.params.id, function ( err, item ){
    item.name    = req.body.content;
    item.save( function ( err, item, count ){
      res.redirect( '/ItemView/'+item._id);
    });
  });
};

//module.exports = router;
