//导出函数
module.exports=function(app){
    app.get('/test',(req,res) => {
        res.render('test',{name:'module...'})
    });
};