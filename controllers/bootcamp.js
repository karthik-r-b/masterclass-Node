// Array todos

const todos = [{ id: 1, name: "workout" }, { id: 2, name: "coding" }]

/*
@desc    Get all the bootcamps
@route   GET /api/
@access  Public
*/

exports.getBootcamps=(req,res,next)=>{
    res.status(200).json({ success: true, data: todos });
}

/*
@desc     Get the specific bootcamp
@route    GET /api/:id
@access   public
*/

exports.getBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,message:`${req.params.id} resource is retrieved`});
}


/*
@desc     create the bootcamp
@route     POST /api/
@access    Private
*/
exports.createBootcamp=(req,res,next)=>{
    res.status(200).json({ success: true, message: `resource got created` });
}



/*
@desc     edit the bootcamp
@route    PUT /api/:id
@access   Private
*/

exports.updateBootcamp=(req,res,next)=>{
    res.status(200).json({ success: true, message: `${req.params.id} got updated` });
}


/*
@desc   delete the bootcamp
@route  DELTE /api/id
@access private
*/

exports.deleteBootcamp=(req,res,next)=>{
    res.status(200).json({ success: true, message: `${req.params.id} got deleted` });
}