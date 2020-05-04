const mongoose = require("mongoose");

const BootCampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"],
        maxlength:[50,'name should not be more than 50 characters'],
        trim : true,
        unique:true
    },
    slug:String,
    description:{
        type:String,
        required:[true,"please enter the description"],
        maxlength:[500,"Character should not be more than 200 characters"],
        trim : true
    },
    website:{
        type:String,
        required:[true,"Please enter the website"],
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please enter the email"],
        match:[/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,'Please enter the valid email id'],
        trim:true
    },
    phone:{
        type:String,
        required:[true,"Please enter the mobile number"],
        maxlength:[20,"Please enter the only 10 digits of your mobile number"]
    },
    address:{
        type:String,
        required:[true,"Please enter the address"],
        trim:true
    },
    location:{
        // GeoJSON point
         
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index:'2dsphere'
    },
    formattedAddress:String,
    street:String,
    city:String,
    zipcode:String,
    country:String,
    },
    careers:{
        // array of strings
        type:[String],
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type:Number,
        min:[1,'Rating must be atleast 1'],
        max:[10,'Rating cannot be more than 10']
    },
    averageCost:Number,
    Photo:{
        type:String,
        default:'no-photo.jpg'
    },
    housing:{
        type:Boolean,
        default:false
    },
    jobAssistance:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model('Bootcamp',BootCampSchema);