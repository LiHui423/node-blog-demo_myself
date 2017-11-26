module.exports=function(app){

    //配置根目录路由
    app.get('/',(req,res) => {//配置首页路由
        //res.sendFile(__dirname+'/views/default.html')
        //res.sendFile(path.join(__dirname+'/views/default.html'));
        res.render('default',{});
        // 规范路径写法
    });

    //配置注册链接的路由
    app.get('/sign-up',(req,res) => {
        //res.sendFile(path.join(__dirname+'/views/sign-up.html'));
        res.render('sign-up',{message:null});
    });

    //配置登录链接的路由
    app.get('/sign-in',(req,res) => {
        //res.sendFile(path.join(__dirname+'/views/sign-in.html'));
        res.render('sign-in',{message:null});
    });

};