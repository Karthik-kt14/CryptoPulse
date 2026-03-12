// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String ,required:true},
//   googleId: { type: String },
//   otp: { type: String },
//   otpExpiresAt: { type: Date },
//   cryptos: { type: [String], default: ['bitcoin', 'ethereum', 'solana','cardano','tron'] }
// });

// module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },

//     password: {
//       type: String,
//       required: true
//     },

//     cryptos: {
//       type: [String],
//       default: []
//     },

//     otp: String,
//     otpExpiresAt: Date
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      default: ""
    },
    otp: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    },
    googleId: {
      type: String,
      default: null
    },

    // IMPORTANT
    cryptos: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);