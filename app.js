/*
 * 需要安装MongoDB
 * 启动的时候先开数据库,如果数据库没问题,但是报无法连接数据库的错
 * 那么把项目移动到无中文名的路径下可以解决
 */
var express=require("express");
var app=express();
var mainctrl=require("./controllers/mainctrl");
var mongoose=require("mongoose");

//链接数据库,写在app文件里面
//node进程始终和数据库保持连接

//连接数据库不是用户的行为,是服务器在连接数据库
//mongoose能够持久保持这个连接,尽管连接数据库语句不是中间件,只能被调用一次

mongoose.connect("mongodb://localhost/dmd");

//设置默认模板引擎
app.set("view engine","ejs");

//静态化public文件夹,使得模板引擎文件能够正常的加载样式表
app.use(express.static("public"));

//中间件(RESTful风格的路由清单)
//show表示给用户看的中间件,而不是Ajax读的

app.get     ("/"                ,mainctrl.showIndex);//显示首页
app.get     ("/addStudent"      ,mainctrl.showAddStudent);  //显示增加学生页面
app.propfind("/student/:sid"    ,mainctrl.doCheck);    //Ajax接口检查学号是否被占用
app.get     ('/student/:sid'	,mainctrl.showUpdate);		//呈递更改学生表单
app.post    ('/student/:sid'	,mainctrl.updateStudent);	//Ajax接口，修改学生信息
app.delete  ('/student/:sid'	,mainctrl.deleteStudent); //删除指定学号的学生
app.post    ("/student"         ,mainctrl.doAddStudent);    //Ajax接口保存表单
app.get     ("/student"			,mainctrl.getAllStudent);	//Ajax接口得到所有学生

app.listen(4000,function(){
    console.log("DEMO运行在了4000端口!");
});
