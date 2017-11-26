const ejs=require('ejs');
console.log(ejs.render('hello,<%=name%>',{name:'EJS！'}));