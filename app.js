const express=require('express');
const path=require('path');

let app=express();

app.get('/',(req,res) => {//配置首页路由
    //res.sendFile(__dirname+'/views/default.html')
    res.sendFile(path.join(__dirname+'/views/default.html'));//规范路径写法
});
//配置注册链接的路由
app.get('/sign-up',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/sign-up.html'));
});

app.listen(80);

