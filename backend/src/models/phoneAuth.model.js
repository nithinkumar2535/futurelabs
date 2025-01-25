import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String
    },
    otpCreatedAt: {
        type: Date
    },
    address: [{
        type: String
    }],
    lastLogin: { type: Date },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

userSchema.methods.generateAccessToken = function(){
    //short lived access token
    return jwt.sign({
        _id: this._id,
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

  export const phoneUser = mongoose.model("User", userSchema)