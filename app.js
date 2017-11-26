//引入模块
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mysql=require('mysql');

let app=express();

//配置中间件
app.use(bodyParser.urlencoded({extended:true}));
//创建数据库连接池
let pool=mysql.createPool({
    connectionlimit:10,//默认值就是10，可以不写
    user:'root'
});

//配置根目录路由
app.get('/',(req,res) => {//配置首页路由
    //res.sendFile(__dirname+'/views/default.html')
    res.sendFile(path.join(__dirname+'/views/default.html'));//规范路径写法
});



//配置注册链接的路由
app.get('/sign-up',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/sign-up.html'));
});
//配置登录链接的路由
app.get('/sign-in',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/sign-in.html'));
});

//添加注册请求
app.post('/signUp',(req,res) => {
    //取得用户填写的用户名和密码，引入body-parser
    let username=req.body.username;
    let password=req.body.password;

   pool.getConnection((err,connection) => {
        if (err) throw err;
        //验证注册时的用户名不能为重复值
        let sql='select * from blog.user where username=?';
        connection.query(sql,[username],(err,results,fields) => {
            if (err) throw err;
            if(results.length===1){
                res.sendFile(path.join(__dirname,'/views/sign-up.html'))
            }else{
                sql='INSERT INTO blog.user VALUE(NULL,?,?)';
                connection.query(sql,[username,password],(err,results,fields) => {
                    if (err) throw err;
                    if(results.affectedRows===1){
                        res.sendFile(path.join(__dirname,'/views/sign-in.html'))
                    }else{
                        res.sendFile(path.join(__dirname,'/views/sign-up.html'))
                    }
                });
                connection.release();
            }
        });
    });

    /*pool.getConnection((err,connection) => {
        if (err) throw err;
        let sql='INSERT INTO blog.user VALUE(NULL,?,?)';
        connection.query(sql,[username,password],(err,results,fields) => {
            if (err) throw err;
            if(results.affectedRows===1){
                res.sendFile(path.join(__dirname,'/views/sign-in.html'))
            }else{
                res.sendFile(path.join(__dirname,'/views/sign-up.html'))
            }
        });
        connection.release();
    });*/

});

//添加登录请求
app.post('/signIn',(req,res) => {
    let username=req.body.username;
    let password=req.body.password;
    pool.getConnection((err,connection) => {
        if (err) throw err;
        let sql='select * from blog.user where username=? and password=?';
        connection.query(sql,[username,password],(err,results,fields) => {
            if (err) throw err;
            if(results.length===1){
                res.sendFile(path.join(__dirname,'/views/index.html'))
            }else{
                res.sendFile(path.join(__dirname,'/views/sign-in.html'))
            }
        })
        connection.release();
    });
});
app.listen(80);

