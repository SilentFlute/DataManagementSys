var Student=require("../models/Student");
var formidable=require("formidable");
var url=require("url");

//显示首页
exports.showIndex=function(req,res){
    res.render("index");
};

//显示添加页面
exports.showAddStudent=function(req, res){
    res.render("addStudent");
};

//提交表单保存数据
exports.doAddStudent=function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        //console.log(fields);
        //(new Student(fields)).save();

        //调用学生类的增加学生的方法--持久数据(存储到数据库的瞬间进行验证)
        Student.addStudent(fields,function(result){
            res.json({"result":result});
        });
    })
};

//检查学号是否被占用
exports.doCheck=function(req, res){
    //拿到路由清单中定义的那个参数
    var sid=req.params.sid;
    //调用后台的检查学号是否冲突方法
    //给前端返回一个json,可用就是{"result":true}
    //反之则是{"result":false}
    Student.checkSid(sid,function(torf){
        res.json({"result":torf});
    });
    //而前端拿到后台返回的数据(值)之后有用
    //要使用这个值来给用户做一个反馈,例如学号可用,显示"恭喜,学号没被占用"
    //学号不可用,显示"学号已被占用,请重新输入"之类
};

//得到数据库中所有学生的信息
exports.getAllStudent=function(req,res){
    //Mongoose分页
    var page=url.parse(req.url,true).query.page||1;
    var pagesize=7;

    //mongoose寻找总条目
    Student.count({},function(err,count){
        //查询数据库中存储的数据
        Student.find({}).limit(pagesize).skip(pagesize*(page-1)).exec(function(err,results){
            res.json({
                "pageAmount":Math.ceil(count/pagesize),
                "results":results
            });
        })
    });

};

//呈递更改学生表单
exports.showUpdate=function(req,res){
    //思路:将页面上的数据(来自数据库中)填写到增加学生的表单上
    //填这些数据要通过ejs填,而不是Ajax来填

    //拿到学号
    var sid=req.params.sid;

    //查找数据库中对应学号的数据,并将数据"填"到表单上
    //直接用类名打点调用find,不需要再在Student类里面增加一个例如findStudentBySid的方法
    Student.find({"sid":sid},function(err,results){
        //呈递页面,带的参数相当于是"字典"
        res.render("update",{
            infoObj:results[0]
        });
    });



};

//修改学生信息
exports.updateStudent=function(req,res){
    //拿到学号
    var sid=req.params.sid;

    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        Student.find({"sid":sid},function(err,results){
            //得到数据库中数据
            var db_info=results[0];

            //将数据库中数据修改为表单里面修改过的数据
            db_info.name=fields.name;
            db_info.sex=fields.sex;
            db_info.age=fields.age;
            //
            // //持久化
            db_info.save(function(err){
                if(err){
                    res.json({"result" : -8});
                }else{
                    res.json({"result" : 8});
                }
            });
        })
    })
};

//删除学生信息
exports.deleteStudent=function(req,res){
    var sid=req.params.sid;
    Student.find({"sid":sid},function(err,results){
            results[0].remove(function(err){
                if(err){
                    //删除失败
                    res.json({"result":-9});
                }else{
                    //删除成功
                    res.json({"result":9});
                }
            })
    })
};