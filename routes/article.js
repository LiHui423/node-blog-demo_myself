
const mysql=require('mysql');

let pool=mysql.createPool({
    user:'root'
});
module.exports=function(app){
    app.post('/article/create',(req,res) => {
        let title=req.body.title;
        let content=req.body.content;
        let photo=null;
        let userId=req.session.userId;

        let sql='INSERT INTO blog.article(title,content,photo,userInd) VALUE(?,?,?,?)';
        pool.getConnection((err,connection) => {
            if (err) throw err;
            connection.query(sql,[title,content,photo,userId],(err,results,fields) => {
                if (err) throw err;
                if(results.affectedRows===1){
                    res.render('index',{session:req.session,message:'published'})
                }else{
                    res.render('index',{session:req.session,message:'error'})
                }
            });
            connection.release();
        });
    });

    //显示博文列表
    app.get('/article/list',(req,res) => {
        let userId=req.session.userId;
        let sql='select * from blog.article where userId=?';
        pool.getConnection((err,connection) => {
            if (err) throw err;
            connection.query(sql,[userId],(err,results,fields) => {
                if (err) throw err;
                //res.render('index',{session:req.session,articles:results})
                res.redirect('/article/list');
            })
        });
        connection.release();
    })
};