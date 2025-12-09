import mongoose from "mongoose";

const DEFAULT_PROFILE_PICTURES = {
  customer:
    "https://i.pinimg.com/736x/2c/bb/0e/2cbb0ee6c1c55b1041642128c902dadd.jpg",
  shop: "https://i.pinimg.com/736x/53/b0/98/53b098486fd6277da1963ccdb74c25c6.jpg",
  admin:
    "https://i.pinimg.com/736x/53/b0/98/53b098486fd6277da1963ccdb74c25c6.jpg",
};

const baseOptions = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    password: { type: String, required: true, minlength: 8 },
    contact_number: { type: String },
    profile_photo_url: { type: String, default: null },
    access_level: {
      type: String,
      enum: ["admin", "base"],
      default: "base",
    },
  },
  baseOptions
);

userSchema.pre("save", function (next) {
  if (
    !this.profile_photo_url &&
    this.role &&
    DEFAULT_PROFILE_PICTURES[this.role]
  ) {
    this.profile_photo_url = DEFAULT_PROFILE_PICTURES[this.role];
  }
  next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
