const Bootcamp = require("../models/BootCamp");
const ErrorResponse = require("../utils/errorResponse");

// Array todos

const todos = [{ id: 1, name: "workout" }, { id: 2, name: "coding" }]

/*
@desc    Get all the bootcamps
@route   GET /api/
@access  Public
*/

exports.getBootcamps= async(req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({success:true,count:bootcamp.length,data:bootcamp});
    } catch (error) {
        next(error);
    }
}

/*
@desc     Get the specific bootcamp
@route    GET /api/:id
@access   public
*/

exports.getBootcamp=async(req,res,next)=>{
  try {
     const bootcamp = await Bootcamp.findById(req.params.id);
     if(!bootcamp){
       return next(new ErrorResponse(`bootcamp is not found with id of ${req.params.id}`,400));
     }
     res.status(200).json({success:true,data:bootcamp});
  } catch (error) {
      next(new ErrorResponse(`bootcamp is not found with id of ${req.params.id}`, 400));
  }
}


/*
@desc     create the bootcamp
@route     POST /api/
@access    Private
*/
exports.createBootcamp=async(req,res,next)=>{
    let result = "";
    try {
        result = await Bootcamp.create(req.body)
        result._id?res.status(201).json({success:true,message:'bootcamp got created'}) : res.status(500).json({success:true,message:'Unexpected failure'});
    } catch (error) {
        next(error);
    }
}



/*
@desc     edit the bootcamp
@route    PUT /api/:id
@access   Private
*/

exports.updateBootcamp=async(req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        if (!bootcamp) {
            return res.status(400).json({ success: false, message:'No data found' })
        }
        res.status(200).json({success:true,data:bootcamp});   
    } catch (error) {
        next(error);
    }
}


/*
@desc   delete the bootcamp
@route  DELTE /api/id
@access private
*/

exports.deleteBootcamp=async(req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return res.status(400).json({success:false,message:'No data found'});
        }
        res.status(200).json({success:true,data:bootcamp});
    } catch (error) {
       next(error);
    }

}