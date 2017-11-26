const bcrypt=require('bcryptjs');
const mysql=require('mysql');

//创建数据库连接池
let pool=mysql.createPool({
    connectionlimit:10,//默认值就是10，可以不写
    user:'root'
});

//专门处理跟用户User有关的所有请求
module.exports=function(app){

//添加注册请求
    app.post('/signUp',(req,res) => {
        //取得用户填写的用户名和密码，引入body-parser
        let username=req.body.username;
        let password=req.body.password;
        let salt=bcrypt.genSaltSync(10);//为加密过程创建一个随机盐，提高密码安全程度，10位
        let encryptedPassword=bcrypt.hashSync(password,salt);

        pool.getConnection((err,connection) => {
            if (err) throw err;
            //验证注册时的用户名不能为重复值
            let sql='select * from blog.user where username=?';
            connection.query(sql,[username],(err,results,fields) => {
                if (err) throw err;
                if(results.length===1){
                    //res.sendFile(path.join(__dirname,'/views/sign-up.html'))
                    res.render('sign-up',{message:'Username already exist.'})
                }else{
                    sql='INSERT INTO blog.user VALUE(NULL,?,?)';
                    connection.query(sql,[username,encryptedPassword],(err,results,fields) => {
                        if (err) throw err;
                        if(results.affectedRows===1){
                            //res.sendFile(path.join(__dirname,'/views/sign-in.html'))
                            res.render('sign-in',{message:'Sign up successful,sign in please.'})
                        }else{
                            //res.sendFile(path.join(__dirname,'/views/sign-up.html'))
                            res.render('sign-up',{message:'error'})
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
            let sql='select * from blog.user where username=?';
            connection.query(sql,[username,password],(err,results,fields) => {
                if (err) throw err;
                if(results.length===1){
                    let encryptedPassword=results[0].password;
                    //console.log(encryptedPassword);
                    if(bcrypt.compareSync(password,encryptedPassword)){
                        //res.sendFile(path.join(__dirname,'views/index.html'))
                        res.render('index',{});
                    }else{
                        //res.sendFile(path.join(__dirname,'/views/sign-in.html'))
                        res.render('sign-in',{message:'invalid password or username'})
                    }
                    res.sendFile(path.join(__dirname,'/views/index.html'))
                }else{
                    //res.sendFile(path.join(__dirname,'/views/sign-in.html'))
                    res.render('sign-in',{message:'invalid password or username'})
                }
            });
            connection.release();
        });
    });
}