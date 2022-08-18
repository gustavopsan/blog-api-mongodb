const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: "String",
        description: "String",
        tag: "String",
        body: "String",
        creatorData: "Object",
        commentsId: "Array",
        visible: "Boolean"
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema);

module.exports = Post;