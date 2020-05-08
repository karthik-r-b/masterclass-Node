const Bootcamp = require("../models/BootCamp");
const ErrorResponse = require("../utils/errorResponse");
const aysncHandler = require("../middlewares/async");


/*
@desc    Get all the bootcamps
@route   GET /api/
@access  Public
*/

exports.getBootcamps= aysncHandler(async(req,res,next)=>{

        const bootcamp = await Bootcamp.find();
        res.status(200).json({success:true,count:bootcamp.length,data:bootcamp});
});

/*
@desc     Get the specific bootcamp
@route    GET /api/:id
@access   public
*/

exports.getBootcamp=aysncHandler(async(req,res,next)=>{
     const bootcamp = await Bootcamp.findById(req.params.id);
     if(!bootcamp){
       return next(new ErrorResponse(`bootcamp is not found with id of ${req.params.id}`,404));
     }
     res.status(200).json({success:true,data:bootcamp});
})


/*
@desc     create the bootcamp
@route     POST /api/
@access    Private
*/
exports.createBootcamp=aysncHandler(async(req,res,next)=>{
    let result = "";
        result = await Bootcamp.create(req.body)
        result._id?res.status(201).json({success:true,message:'bootcamp got created'}) : res.status(500).json({success:true,message:'Unexpected failure'});
})



/*
@desc     edit the bootcamp
@route    PUT /api/:id
@access   Private
*/

exports.updateBootcamp=aysncHandler(async(req,res,next)=>{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        if (!bootcamp) {
            return res.status(404).json({ success: false, message:'No data found' })
        }
        res.status(200).json({success:true,data:bootcamp});    
})


/*
@desc   delete the bootcamp
@route  DELTE /api/id
@access private
*/

exports.deleteBootcamp=aysncHandler(async(req,res,next)=>{

        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return res.status(404).json({success:false,message:'No data found'});
        }
        res.status(200).json({success:true,data:bootcamp});

})