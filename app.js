//引入模块
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');


const ejs=require('ejs');

let app=express();

//配置中间件
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.html',ejs.__express);
app.set('view engine','html');


require('./routes/default.js')(app);
require('./routes/user.js')(app);
app.listen(80);

