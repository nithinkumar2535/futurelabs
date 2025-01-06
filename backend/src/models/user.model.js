import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        
    },
    email: {
       type: String,
       required: true 
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
},
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
try {
    
        if(!this.isModified("password")) return next()
    
        this.password = await bcrypt.hash(this.password, 10)
        next()
} catch (error) {
    next(error)
}
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    //short lived access token
    return jwt.sign({
        _id: this._id,
        username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

userSchema.methods.generateRefreshToken = function () {
  //long lived access token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};


export const User = mongoose.model("Admin", userSchema)