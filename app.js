if(process.env.NODE_ENV != "production"){
require('dotenv').config({quiet:true});
}

// console.log(`Hello ${process.env.HELLO}`)


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const wrapAsync=require("./util/wrapAsync.js");
const expressError=require("./util/expressError.js");
const{listingSchema,reviewSchema}=require("./schema.js")

const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/user.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})
async function main(){
   await mongoose.connect( dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};

// app.get("/",(req,res)=>{
//     console.log("working");
//     res.send("welcome to home page");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
   res.locals.success=req.flash("success"); 
   res.locals.error=req.flash("error"); 
//    console.log(res.locals.success);
res.locals.currUser=req.user;
  next();
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })
//     let registeredUser=await User.register(fakeUser,"helloworls");
//     res.send(registeredUser);
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//          title:"my new villa",
//     description:"very beautiful",
//     price:700,
//     country:"india",
//     })
//    await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
   

// })


// app.get("/users", async (req, res) => {
//     const users = await User.find({}).lean();
//     console.log(users);
//     res.json(users);
// });
// app.get("/check", (req, res) => {
//     res.json({
//         register: typeof User.register,
//         authenticate: typeof User.authenticate,
//         seriFalizeUser: typeof User.serializeUser,
//         deserializeUser: typeof User.deserializeUser,
//         schemaPaths: Object.keys(User.schema.paths),
//     });
// });
// app.get("/deleteUsers", assync (req, res) => {
//     await User.deleteMany({});
//     res.send("All users deleted");
// });


//all route
app.all("/*splat",(req,res,next)=>{
    next(new expressError(404,"you entered wrong path"));
})
//create new route middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    // res.status(statusCode).render("listings/error", { message });
    res.render("listings/error.ejs",{err});
});
    // res.status(statusCode).send(message);
    // res.send("semething went wrong");



app.listen(8080,()=>{
    console.log("app is listening at port 8080");
})