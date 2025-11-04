import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  provider: String,
  providerId: String,
  name: String,
  email: String,
  photo: String,
});

const User = mongoose.model("User", userSchema);
export default User;
