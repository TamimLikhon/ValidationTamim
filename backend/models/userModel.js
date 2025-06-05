import mongoose, { models } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    AccountVerified: {
        type: Boolean,
        default: false,
    },
    AccountVerificationCode: {
        type: String,
        default: null,
    },
    AccountVerificationCodeExpires: {
        type: Date,
        default: null,
    },
    verificationCode: {
        type: String,
        default: null,
    },
    verificationCodeExpires: {
        type: Date,
        default: null,
    },
    passChangeCode: {
        type: String,
        default: null,
    },
    passChangeCodeExpires: {
        type: Date,
        default: null,
    },
    twofaEnabled: {
        type: Boolean,
        default: false,
    },
    twofaSecret: {
        type: String,
        default: null,
    },
    twofaCode: {
        type: String,
        default: [],
    },
    twofaCodeExpires: {
        type: Date,
        default: null,
    },

}, {
    timestamps: true,
    versionKey: false,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

