const express = require('express');
const router = express.Router();

// Array todos

const todos= [{id:1,name:"workout"},{id:2,name:"coding"}]


router.get("/",(req,res)=>{
    res.status(200).json({ success: true, data: todos});
})

router.post("/",(req,res)=>{
    res.status(200).json({success:true,message:`resource got created`});
})

router.put("/:id",(req,res)=>{
    res.status(200).json({ success: true, message: `${req.params.id} got updated`});
})

router.delete("/:id",(req,res)=>{
    res.status(200).json({ success: true, message: `${req.params.id} got deleted`});
})

module.exports = router;