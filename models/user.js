// const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);
// console.log(Object.keys(passportLocalMongoose));
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const passportLocalMongoose = require("passport-local-mongoose");

// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//     },
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);