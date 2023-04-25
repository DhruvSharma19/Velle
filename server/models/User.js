import mongoose from 'mongoose';

const UserSchema=mongoose.Schema({
   name:{
    type:String,
    required:true,
    unique:true,
   },
   email:{
    type:String,
    required:true,
    unique:true,
   },
   img:{
    type:String,
    default:null,
   },
   banner:{
    type:String,
    default:null,
   },
   about:{
    type:String,
    default:null,
   },
   password:{
    type:String,
   },
   friends:{
    type:[String],
   },
   requests:{
    type:[String], 
   },
   following:{
    type:[String],
   },
   fromGoogle:{
      type:Boolean,
      default:false,
  }

},{timestamps:true});


export default mongoose.model("User",UserSchema);