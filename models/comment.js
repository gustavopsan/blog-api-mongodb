const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        articleId: "String",
        creatorId: "String",
        creatorName: "String",
        creatorAvatar: "String",
        body: "String",
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;