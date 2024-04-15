const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    } ,
    email:{
        type: String,
        required: true,
    } ,
    mobile:{
        type: String
    },
    address:{
        type:String,
        required: true
    },
    aadharCardNumer:{
        type: Number,
        unique:true,
        required:true
      
       
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['voter', 'admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default : false
    }

 

});

userSchema.pre('save', async function (next) {
    const person = this;
    // hash the password only when the password modified and new
  if(!person.isModified('password')) 
   next();  // password me modificatin nahi hai

  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(person.password, salt);
     person.password = hashedPassword;
  } catch (error) {
    return next(error);
  }

})

userSchema.methods.comparePassword = async function (candidatePassword){
    try {
        const isMatched = await bcrypt.compare(candidatePassword, this.password);
        return isMatched;
    } catch (error) {
         throw error;
    }
}




// create a person model           // person nam model
const User = mongoose.model('User', userSchema);
module.exports = User;