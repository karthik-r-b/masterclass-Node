const errorHandler=(err, req, res, next)=>{
    // log to the dev console.
    console.log(err.stack.red);
    res.status(err.statuscode || 500).json({success:false,message:err.message || 'server error'});
}

module.exports = errorHandler;