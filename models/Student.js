/**
 * 这是一个类,所以习惯性的把首字母大写了
 */

var mongoose=require("mongoose");

//创建schema
var studentSchema=new mongoose.Schema({
    sid:Number,
    name:String,
    sex:String,
    age:Number
});

//静态方法,增加学生
studentSchema.statics.addStudent=function(json,callback){
    //检查id是否被占用(后端检查)
    Student.checkSid(json.sid,function(torf){
        //没有被占用,就保存;保存的时候还有存储成功和失败的情况
        switch(torf){
            case true:
                //没有相同的id,学号可用,进行保存操作
                var s=new Student(json);
                s.save(function(err){
                    if(err){
                        //服务器错误,请稍后再试!
                        callback(-2);
                    }else{
                        //保存成功!
                        callback(1);
                    }
                });
                break;
            case false:
                //学号被占用,无法存储数据
                callback(-1);
                break;
            case 0:
                //用户没填学号,什么也没填,什么也没做,直接点的提交
                callback(0);
                break;
        }
    });

};

studentSchema.statics.checkSid=function(sid,callback){
    this.find({"sid":sid},function(err,results){
        //如何验证一个东西是否存在,看数组长度即可
        //如果没有相同的id，返回true
        //如果有相同的id返回false

        //用户如果没有填写学号等信息,直接点的提交,这个时候results就为undefined
        //此时直接给回调函数中传参数0
        if(results===undefined){
            callback(0);
        }else{
            callback(results.length===0);
        }
    });
};


//而此时由于连接数据库的语句在app.js中,因此没法进行单元测试

//类(表名首字母自动小写,然后表名单词变成复数形式)
//类的创建写在静态&动态方法的后面
var Student=mongoose.model("Student",studentSchema);

module.exports=Student;
