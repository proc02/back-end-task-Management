const mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/taskmanager',{useNewUrlParser:true,useUnifiedTopology: true})
.then(() =>{
    console.log("connect to db success")
}).catch((err)=>{
    console.log('connect to db failed');
    console.log(err);
});

mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

module.exports = {
    mongoose
};