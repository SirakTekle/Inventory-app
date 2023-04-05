const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be up to 6 characters"],
      //maxLength: [35, "Password must not exceed more than 35 characters"],
    },
    photo: {
      type: String,
      default: "https://i.ibb.co/4pDNDK1/avatar.png",
    },
    phone: {
      type: String,
      default: "+669",
    },
    bio: {
      type: String,
      default: "bio",
      maxLength: [250, "Bio must not exceed more than 250 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// encrpt password before saving to DB

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
