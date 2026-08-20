const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAsync.js");

const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const ListingController=require("../controllers/listings.js");
const { renderFile } = require("ejs");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage })


router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single('listing[image][url]'),wrapAsync(ListingController.createListing)
);


// create new route
router.get("/new",isLoggedIn,(ListingController.renderNewForm))


router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing))




//index route

// router.get("/", wrapAsync(ListingController.index));



// router.post("/listings",async(req,res)=>{
//     let{title,description,image,price,location,country}=req.body;


//     let newListing=new Listing(
//         {
//             title:title,
//             description:description,
//             image:image,
//             price:price,
//             location:location,
//             country:country,
//         }
//     )
//     newListing.save()
//     .then((req,res)=>{
//         console.log("listing is saved");

//     }).catch((err)=>{
//         console.log("err");
//     })
//     res.redirect("/listings");
// })

//another method 2 for new route for post
// router.post("/",isLoggedIn,validateListing,wrapAsync(ListingController.createListing))


//read route ->show.ejs file 
//show route
// router.get("/:id",wrapAsync(async (req,res)=>{
//     let{id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews").populate("owner");
//     if(!listing){
//         req.flash("error","listing you requested does not exist!"); 
//         res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs",{listing});
// }))

//show route
// router.get("/:id", wrapAsync(ListingController.showListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))

//new edit route(update route)=>put(for new edit store) 
//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing))

//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing))
module.exports=router;