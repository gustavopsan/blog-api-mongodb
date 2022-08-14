const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: "String",
        email: { type: "String", unique: true },
        password: "String",
        biography: "String",
        avatar: "String",
        active: "Boolean"
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;