const Listing =require("../models/listing.js");

module.exports.index=async (req,res)=>{
   let allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs")
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id)
        .populate({path:"reviews",
            populate:{
                path:"author",
            }
        })
        .populate("owner");


    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async(req,res)=>{
    // let listing=req.body.listing;
    // console.log(listing);
    // if(!req.body.listing){
    //     throw new expressError(400,"send valid data for listing");
    // }
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.err){
    //     throw new expressError(400,result.error);
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
//    console.log(req.body);
//    console.log(req.body.listing);
    const newListing=new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};

    await newListing.save();
     console.log("SAVED LISTING:", newListing);

    req.flash("success","new listing created");
     res.redirect("/listings");
    }

module.exports.renderEditForm=async(req,res)=>{
let{id}=req.params;
const listing=await Listing.findById(id);
if(!listing){
        req.flash("error","listing yaou requested does not exist!"); 
       return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/h_250,w_250,c_fill");
res.render("listings/edit.ejs",{listing,originalImageUrl});

}

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
 let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
     req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
     }

module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findByIdAndDelete(id);
    console.log(listing);
     req.flash("success","listing deleted");
    res.redirect("/listings");
}     

