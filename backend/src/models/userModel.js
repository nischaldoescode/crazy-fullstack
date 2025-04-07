import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    verificationCode: String,
    codeExpiresAt: Date,
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
